ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS idempotency_key uuid;
ALTER TABLE public.orders
    ALTER COLUMN order_number TYPE varchar(50);

CREATE UNIQUE INDEX IF NOT EXISTS orders_user_id_idempotency_key_idx
    ON public.orders (user_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.offers ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE public.offers
    ALTER COLUMN currency TYPE varchar(3)
    USING CASE
        WHEN btrim(currency::text) = '' OR upper(btrim(currency::text)) = 'M' THEN 'MXN'
        ELSE upper(btrim(currency::text))
    END;
ALTER TABLE public.offers ALTER COLUMN currency SET DEFAULT 'MXN';

ALTER TABLE public.orders ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE public.orders
    ALTER COLUMN currency TYPE varchar(3)
    USING CASE
        WHEN btrim(currency::text) = '' OR upper(btrim(currency::text)) = 'M' THEN 'MXN'
        ELSE upper(btrim(currency::text))
    END;
ALTER TABLE public.orders ALTER COLUMN currency SET DEFAULT 'MXN';

ALTER TABLE public.payments ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE public.payments
    ALTER COLUMN currency TYPE varchar(3)
    USING CASE
        WHEN btrim(currency::text) = '' OR upper(btrim(currency::text)) = 'M' THEN 'MXN'
        ELSE upper(btrim(currency::text))
    END;
ALTER TABLE public.payments ALTER COLUMN currency SET DEFAULT 'MXN';

UPDATE public.offers SET currency = 'MXN';
UPDATE public.orders SET currency = 'MXN';
UPDATE public.payments SET currency = 'MXN';

CREATE INDEX IF NOT EXISTS key_inventory_available_offer_idx
    ON public.key_inventory (offer_id, created_at, id)
    WHERE status = 'available';

CREATE INDEX IF NOT EXISTS key_inventory_order_item_idx
    ON public.key_inventory (order_item_id)
    WHERE order_item_id IS NOT NULL;

CREATE SEQUENCE IF NOT EXISTS public.orders_short_number_seq;

CREATE OR REPLACE FUNCTION public.prevent_sold_key_reuse()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    IF OLD.status = 'sold' AND TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'SOLD_KEY_IMMUTABLE' USING ERRCODE = '23514';
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.status = 'sold' AND (
        NEW.status IS DISTINCT FROM OLD.status
        OR NEW.offer_id IS DISTINCT FROM OLD.offer_id
        OR NEW.order_item_id IS DISTINCT FROM OLD.order_item_id
        OR NEW.key_ciphertext IS DISTINCT FROM OLD.key_ciphertext
    ) THEN
        RAISE EXCEPTION 'SOLD_KEY_IMMUTABLE' USING ERRCODE = '23514';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS key_inventory_prevent_sold_reuse ON public.key_inventory;
CREATE TRIGGER key_inventory_prevent_sold_reuse
    BEFORE UPDATE OR DELETE ON public.key_inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_sold_key_reuse();

CREATE OR REPLACE FUNCTION public.create_demo_order(
    p_lines jsonb,
    p_idempotency_key uuid,
    p_coupon_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_line jsonb;
    v_offer record;
    v_offer_id uuid;
    v_quantity integer;
    v_key_ids uuid[];
    v_allocations jsonb := '[]'::jsonb;
    v_allocation jsonb;
    v_order_id uuid;
    v_order_number text;
    v_order_sequence bigint;
    v_existing_order record;
    v_order_item_id uuid;
    v_currency text;
    v_order_currency text;
    v_subtotal numeric(12, 2) := 0;
    v_discount numeric(12, 2) := 0;
    v_total numeric(12, 2);
    v_updated_keys integer;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '28000';
    END IF;

    IF p_idempotency_key IS NULL THEN
        RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED' USING ERRCODE = '22023';
    END IF;

    IF p_lines IS NULL OR jsonb_typeof(p_lines) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'INVALID_ORDER_LINES' USING ERRCODE = '22023';
    END IF;

    IF jsonb_array_length(p_lines) = 0 OR jsonb_array_length(p_lines) > 25 THEN
        RAISE EXCEPTION 'INVALID_ORDER_LINES' USING ERRCODE = '22023';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM jsonb_to_recordset(p_lines) AS line(offer_id uuid, quantity integer)
        WHERE line.offer_id IS NULL OR line.quantity IS NULL OR line.quantity < 1 OR line.quantity > 50
    ) OR EXISTS (
        SELECT line.offer_id
        FROM jsonb_to_recordset(p_lines) AS line(offer_id uuid, quantity integer)
        GROUP BY line.offer_id
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'INVALID_ORDER_LINES' USING ERRCODE = '22023';
    END IF;

    PERFORM pg_advisory_xact_lock(
        hashtextextended(v_user_id::text || ':' || p_idempotency_key::text, 0)
    );

    SELECT orders.id, orders.order_number, orders.status, orders.subtotal,
           orders.discount, orders.total, orders.currency, orders.created_at
    INTO v_existing_order
    FROM public.orders
    WHERE orders.user_id = v_user_id
      AND orders.idempotency_key = p_idempotency_key;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'id', v_existing_order.id,
            'order_number', v_existing_order.order_number,
            'status', v_existing_order.status,
            'subtotal', v_existing_order.subtotal,
            'discount', v_existing_order.discount,
            'total', v_existing_order.total,
            'currency', btrim(v_existing_order.currency::text),
            'created_at', v_existing_order.created_at
        );
    END IF;

    FOR v_line IN
        SELECT value
        FROM jsonb_array_elements(p_lines) AS line(value)
        ORDER BY value->>'offer_id'
    LOOP
        v_offer_id := (v_line->>'offer_id')::uuid;
        v_quantity := (v_line->>'quantity')::integer;

        SELECT offers.price,
               offers.currency::text AS currency,
               offers.edition,
               games.title AS game_title,
               platforms.name AS platform_name,
               regions.name AS region_name
        INTO v_offer
        FROM public.offers
        JOIN public.games ON games.id = offers.game_id
        JOIN public.platforms ON platforms.id = offers.platform_id
        JOIN public.regions ON regions.id = offers.region_id
        WHERE offers.id = v_offer_id
          AND offers.status = 'published'
        FOR UPDATE OF offers;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'OFFER_NOT_AVAILABLE' USING ERRCODE = 'P0002';
        END IF;

        v_currency := upper(coalesce(nullif(btrim(v_offer.currency), ''), 'MXN'));
        IF v_currency <> 'MXN' THEN
            RAISE EXCEPTION 'ONLY_MXN_OFFERS_SUPPORTED' USING ERRCODE = '22023';
        END IF;

        IF v_order_currency IS NULL THEN
            v_order_currency := v_currency;
        ELSIF v_currency <> v_order_currency THEN
            RAISE EXCEPTION 'MIXED_CURRENCIES' USING ERRCODE = '22023';
        END IF;

        SELECT array_agg(available_key.id)
        INTO v_key_ids
        FROM (
            SELECT inventory.id
            FROM public.key_inventory AS inventory
            WHERE inventory.offer_id = v_offer_id
              AND inventory.status = 'available'
              AND btrim(inventory.key_ciphertext) <> ''
            ORDER BY inventory.created_at NULLS FIRST, inventory.id
            LIMIT v_quantity
            FOR UPDATE OF inventory SKIP LOCKED
        ) AS available_key;

        IF coalesce(cardinality(v_key_ids), 0) <> v_quantity THEN
            RAISE EXCEPTION 'NO_STOCK' USING ERRCODE = 'P0001';
        END IF;

        v_subtotal := v_subtotal + (v_offer.price * v_quantity);
        v_allocations := v_allocations || jsonb_build_array(jsonb_build_object(
            'offer_id', v_offer_id,
            'quantity', v_quantity,
            'unit_price', v_offer.price,
            'edition', v_offer.edition,
            'game_title', v_offer.game_title,
            'platform_name', v_offer.platform_name,
            'region_name', v_offer.region_name,
            'key_ids', to_jsonb(v_key_ids)
        ));
    END LOOP;

    IF upper(coalesce(p_coupon_code, '')) = 'GAMER2025' THEN
        v_discount := round(v_subtotal * 0.15, 2);
    END IF;
    v_total := v_subtotal - v_discount;

    INSERT INTO public.profiles (id, username)
    VALUES (
        v_user_id,
        'customer_' || left(replace(v_user_id::text, '-', ''), 12)
    )
    ON CONFLICT (id) DO NOTHING;

    LOOP
        v_order_sequence := nextval('public.orders_short_number_seq');
        IF v_order_sequence > 99999999 THEN
            RAISE EXCEPTION 'ORDER_NUMBER_CAPACITY_EXCEEDED' USING ERRCODE = '54000';
        END IF;

        v_order_number := 'NX' || lpad(v_order_sequence::text, 8, '0');
        EXIT WHEN NOT EXISTS (
            SELECT 1
            FROM public.orders
            WHERE order_number = v_order_number
        );
    END LOOP;

    INSERT INTO public.orders (
        user_id, order_number, idempotency_key, status, subtotal, discount,
        total, currency, customer_email
    )
    VALUES (
        v_user_id, v_order_number, p_idempotency_key, 'completed', v_subtotal,
        v_discount, v_total, 'MXN', auth.jwt()->>'email'
    )
    RETURNING id INTO v_order_id;

    INSERT INTO public.payments (
        order_id, provider, transaction_reference, amount, currency, status, paid_at
    )
    VALUES (
        v_order_id, 'simulated', 'SIM-' || p_idempotency_key::text, v_total,
        'MXN', 'approved', now()
    );

    FOR v_allocation IN
        SELECT value FROM jsonb_array_elements(v_allocations) AS allocation(value)
    LOOP
        INSERT INTO public.order_items (
            order_id, offer_id, game_title, platform_name, region_name,
            edition, quantity, unit_price, subtotal
        )
        VALUES (
            v_order_id,
            (v_allocation->>'offer_id')::uuid,
            v_allocation->>'game_title',
            v_allocation->>'platform_name',
            v_allocation->>'region_name',
            v_allocation->>'edition',
            (v_allocation->>'quantity')::integer,
            (v_allocation->>'unit_price')::numeric,
            (v_allocation->>'unit_price')::numeric * (v_allocation->>'quantity')::integer
        )
        RETURNING id INTO v_order_item_id;

        UPDATE public.key_inventory
        SET status = 'sold',
            reserved_until = NULL,
            order_item_id = v_order_item_id
        WHERE id = ANY (
            ARRAY(
                SELECT key_id::uuid
                FROM jsonb_array_elements_text(v_allocation->'key_ids') AS keys(key_id)
            )
        )
          AND status = 'available';

        GET DIAGNOSTICS v_updated_keys = ROW_COUNT;
        IF v_updated_keys <> (v_allocation->>'quantity')::integer THEN
            RAISE EXCEPTION 'INVENTORY_ALLOCATION_CONFLICT' USING ERRCODE = 'P0001';
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', v_order_number,
        'status', 'completed',
        'subtotal', v_subtotal,
        'discount', v_discount,
        'total', v_total,
        'currency', 'MXN',
        'created_at', now()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_demo_order(p_order_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT jsonb_build_object(
        'id', orders.id,
        'order_number', orders.order_number,
        'status', orders.status,
        'subtotal', orders.subtotal,
        'discount', orders.discount,
        'total', orders.total,
        'currency', 'MXN',
        'created_at', orders.created_at,
        'items', coalesce((
            SELECT jsonb_agg(jsonb_build_object(
                'game_title', order_items.game_title,
                'platform_name', order_items.platform_name,
                'region_name', order_items.region_name,
                'edition', order_items.edition,
                'quantity', order_items.quantity,
                'unit_price', order_items.unit_price,
                'subtotal', order_items.subtotal
            ) ORDER BY order_items.created_at)
            FROM public.order_items
            WHERE order_items.order_id = orders.id
        ), '[]'::jsonb)
    )
    FROM public.orders
    WHERE orders.id = p_order_id
      AND orders.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_purchased_keys()
RETURNS TABLE (
    key_id uuid,
    order_id uuid,
    order_number varchar,
    purchased_at timestamptz,
    game_title varchar,
    platform_name varchar,
    region_name varchar,
    edition varchar,
    cover_url text,
    key_ciphertext text,
    key_hint varchar,
    unit_price numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT inventory.id,
           orders.id,
           orders.order_number,
           orders.created_at,
           order_items.game_title,
           order_items.platform_name,
           order_items.region_name,
           order_items.edition,
           games.cover_url,
           inventory.key_ciphertext,
           inventory.key_hint,
           order_items.unit_price
    FROM public.key_inventory AS inventory
    JOIN public.order_items ON order_items.id = inventory.order_item_id
    JOIN public.orders ON orders.id = order_items.order_id
    JOIN public.offers ON offers.id = order_items.offer_id
    JOIN public.games ON games.id = offers.game_id
    WHERE orders.user_id = auth.uid()
      AND orders.status = 'completed'
      AND inventory.status = 'sold'
    ORDER BY orders.created_at DESC, orders.order_number DESC, inventory.id;
$$;

REVOKE ALL ON FUNCTION public.create_demo_order(jsonb, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_my_demo_order(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_my_purchased_keys() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_demo_order(jsonb, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_demo_order(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_purchased_keys() TO authenticated;
