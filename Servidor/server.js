require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

app.use(express.json());

function createSupabaseClient(url, anonKey, accessToken) {
    return createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false,
        },
        ...(accessToken ? {
            global: {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        } : {}),
    });
}

async function authenticateRequest(req) {
    const authorization = req.get('authorization') || '';
    const accessToken = authorization.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : '';

    if (!accessToken) {
        return { error: { status: 401, message: 'Inicia sesión para continuar.' } };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        return { error: { status: 503, message: 'El servicio de autenticación no está configurado.' } };
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, accessToken);
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
        return { error: { status: 401, message: 'La sesión expiró. Inicia sesión de nuevo.' } };
    }

    return { supabase, user: data.user };
}

function decryptInventoryKey(value) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new Error('La clave guardada no tiene un formato válido.');
    }

    if (!value.startsWith('enc:')) {
        return value;
    }

    const [prefix, version, encodedIv, encodedTag, encodedCiphertext, ...extra] = value.split(':');
    if (prefix !== 'enc' || version !== 'v1' || !encodedIv || !encodedTag || !encodedCiphertext || extra.length > 0) {
        const error = new Error('La clave está cifrada en un formato no compatible.');
        error.code = 'KEY_DECRYPTION_FORMAT';
        throw error;
    }

    const encryptionSecret = process.env.KEY_ENCRYPTION_KEY;
    if (!encryptionSecret) {
        const error = new Error('Falta configurar KEY_ENCRYPTION_KEY para revelar las claves cifradas.');
        error.code = 'KEY_DECRYPTION_CONFIG';
        throw error;
    }

    const encryptionKey = /^[0-9a-f]{64}$/i.test(encryptionSecret)
        ? Buffer.from(encryptionSecret, 'hex')
        : Buffer.from(encryptionSecret, 'base64');
    const iv = Buffer.from(encodedIv, 'base64');
    const authTag = Buffer.from(encodedTag, 'base64');
    const ciphertext = Buffer.from(encodedCiphertext, 'base64');

    if (encryptionKey.length !== 32 || iv.length !== 12 || authTag.length !== 16 || ciphertext.length === 0) {
        const error = new Error('La configuración de cifrado de las claves es inválida.');
        error.code = 'KEY_DECRYPTION_CONFIG';
        throw error;
    }

    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

// Ruta de prueba
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente'
    });
});

app.get('/api/catalogo', async (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio del catálogo no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const [gamesResult, categoriesResult, platformsResult] = await Promise.all([
            supabase
                .from('games')
                .select('id,title,slug,description,synopsis,developer,publisher,franchise,release_date,cover_url,banner_url,trailer_url,game_categories(categories(id,name,slug)),offers!inner(id,price,original_price,currency,edition,delivery_type,promotion_starts_at,promotion_ends_at,status,platforms(id,name,slug),regions(id,name,code),drms(id,name,slug))')
                .eq('offers.status', 'published')
                .order('title'),
            supabase.from('categories').select('id,name,slug').order('name'),
            supabase.from('platforms').select('id,name,slug').eq('active', true).order('name'),
        ]);

        const failedQuery = [gamesResult, categoriesResult, platformsResult].find(result => result.error);
        if (failedQuery) {
            console.error('Catalog query failed:', failedQuery.error.code || failedQuery.error.message);
            return res.status(502).json({ message: 'No se pudieron cargar los juegos desde la base de datos.' });
        }

        const games = gamesResult.data.map(game => ({
            id: game.id,
            title: game.title,
            slug: game.slug,
            description: game.synopsis || game.description,
            developer: game.developer,
            publisher: game.publisher,
            franchise: game.franchise,
            release_date: game.release_date,
            cover_url: game.cover_url,
            banner_url: game.banner_url,
            trailer_url: game.trailer_url,
            categories: (game.game_categories || [])
                .map(link => link.categories)
                .filter(Boolean),
            offers: (game.offers || []).map(offer => ({
                id: offer.id,
                price: Number(offer.price),
                original_price: offer.original_price === null ? null : Number(offer.original_price),
                currency: 'MXN',
                edition: offer.edition,
                delivery_type: offer.delivery_type,
                promotion_starts_at: offer.promotion_starts_at,
                promotion_ends_at: offer.promotion_ends_at,
                platform: offer.platforms,
                region: offer.regions,
                drm: offer.drms,
            })),
        }));

        const categoryIds = new Set(games.flatMap(game => game.categories.map(category => category.id)));
        const platformIds = new Set(games.flatMap(game => game.offers.map(offer => offer.platform?.id)));

        return res.json({
            games,
            categories: categoriesResult.data.filter(category => categoryIds.has(category.id)),
            platforms: platformsResult.data.filter(platform => platformIds.has(platform.id)),
        });
    } catch (error) {
        console.error('Catalog request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con la base de datos del catálogo.' });
    }
});

app.post('/api/orders/demo', async (req, res) => {
    const items = req.body?.items;
    const couponCode = req.body?.coupon_code ?? null;
    const idempotencyKey = req.get('Idempotency-Key') || '';
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!Array.isArray(items) || items.length === 0 || items.length > 25) {
        return res.status(400).json({ message: 'El carrito está vacío o contiene demasiados productos.' });
    }

    if (!uuidPattern.test(idempotencyKey)) {
        return res.status(400).json({ message: 'No se recibió una clave de solicitud válida.' });
    }

    const seenOffers = new Set();
    for (const item of items) {
        if (
            !item
            || typeof item.offer_id !== 'string'
            || !uuidPattern.test(item.offer_id)
            || !Number.isInteger(item.quantity)
            || item.quantity < 1
            || item.quantity > 50
            || seenOffers.has(item.offer_id)
        ) {
            return res.status(400).json({ message: 'El carrito contiene productos o cantidades inválidos.' });
        }
        seenOffers.add(item.offer_id);
    }

    if (couponCode !== null && couponCode !== 'GAMER2025') {
        return res.status(400).json({ message: 'El cupón indicado no es válido.' });
    }

    try {
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return res.status(auth.error.status).json({ message: auth.error.message });
        }

        const { data, error } = await auth.supabase.rpc('create_demo_order', {
            p_lines: items,
            p_idempotency_key: idempotencyKey,
            p_coupon_code: couponCode,
        });

        if (error) {
            if (error.code === 'P0001') {
                const message = error.message.includes('NO_STOCK')
                    ? 'No hay suficientes keys disponibles. No se creó la orden.'
                    : 'El inventario cambió durante la compra. No se creó la orden; inténtalo de nuevo.';
                return res.status(409).json({ message });
            }
            if (error.code === 'P0002') {
                return res.status(409).json({ message: 'Una oferta del carrito ya no está disponible. No se creó la orden.' });
            }
            if (error.code === '22023' && error.message.includes('ONLY_MXN')) {
                return res.status(409).json({ message: 'La oferta no está configurada en pesos mexicanos. No se creó la orden.' });
            }
            if (error.code === '22023') {
                return res.status(400).json({ message: 'El carrito tiene datos inválidos. No se creó la orden.' });
            }

            console.error('Demo order RPC failed:', {
                code: error.code || 'unknown error',
                message: error.message || 'No database error message returned.',
                details: error.details || null,
                hint: error.hint || null,
            });
            return res.status(502).json({ message: 'No se pudo registrar la compra simulada.' });
        }

        return res.status(201).json({ order: data });
    } catch (error) {
        console.error('Demo order request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de órdenes.' });
    }
});

app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(orderId)) {
        return res.status(400).json({ message: 'El número de orden solicitado no es válido.' });
    }

    try {
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return res.status(auth.error.status).json({ message: auth.error.message });
        }

        const { data, error } = await auth.supabase.rpc('get_my_demo_order', {
            p_order_id: orderId,
        });
        if (error) {
            console.error('Demo order lookup failed:', error.code || 'unknown error');
            return res.status(502).json({ message: 'No se pudo consultar la orden.' });
        }
        if (!data) {
            return res.status(404).json({ message: 'No se encontró la orden solicitada.' });
        }

        return res.json({ order: data });
    } catch (error) {
        console.error('Demo order lookup request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de órdenes.' });
    }
});

app.get('/api/keys', async (req, res) => {
    try {
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return res.status(auth.error.status).json({ message: auth.error.message });
        }

        const { data, error } = await auth.supabase.rpc('get_my_purchased_keys');
        if (error) {
            console.error('Purchased keys RPC failed:', error.code || 'unknown error');
            return res.status(502).json({ message: 'No se pudieron consultar tus claves.' });
        }

        const keys = data.map(item => ({
            id: item.key_id,
            orderId: item.order_id,
            orderNumber: item.order_number,
            purchasedAt: item.purchased_at,
            gameTitle: item.game_title,
            platform: item.platform_name,
            region: item.region_name,
            edition: item.edition,
            coverUrl: item.cover_url,
            key: decryptInventoryKey(item.key_ciphertext),
            keyHint: item.key_hint,
            unitPrice: Number(item.unit_price),
            currency: 'MXN',
        }));

        return res.json({ keys });
    } catch (error) {
        console.error('Purchased keys request failed:', error.message);
        if (error.code === 'KEY_DECRYPTION_CONFIG' || error.code === 'KEY_DECRYPTION_FORMAT') {
            return res.status(503).json({ message: error.message });
        }
        return res.status(502).json({ message: 'No se pudieron cargar las claves de la bóveda.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        return res.status(400).json({ message: 'Ingresa tu correo y contraseña.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de autenticación no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            if (error.code === 'email_not_confirmed') {
                return res.status(403).json({ message: 'Confirma tu correo antes de iniciar sesión.' });
            }

            if (error.status === 400 || error.status === 401) {
                return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
            }

            if (error.status === 429) {
                return res.status(429).json({ message: 'Demasiados intentos. Espera un momento y vuelve a probar.' });
            }

            console.error('Supabase login failed:', error.code || error.status || 'unknown error');
            return res.status(502).json({ message: 'No se pudo validar el acceso con Supabase.' });
        }

        if (!data.session) {
            return res.status(401).json({ message: 'Supabase no devolvió una sesión válida.' });
        }

        return res.json({
            session: data.session,
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
            },
        });
    } catch (error) {
        console.error('Supabase login request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de autenticación.' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!username || username.length > 40 || !email || password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ message: 'Revisa el gamertag, correo y los requisitos de contraseña.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de registro no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            if (error.code === 'user_already_exists' || error.status === 409) {
                return res.status(409).json({ message: 'No se pudo crear la cuenta. Verifica que el correo y gamertag estén disponibles.' });
            }

            if (error.status === 400) {
                return res.status(400).json({ message: 'Supabase rechazó los datos. Revisa el correo y los requisitos de contraseña.' });
            }

            if (error.status === 429) {
                return res.status(429).json({ message: 'Demasiados intentos. Espera un momento y vuelve a probar.' });
            }

            console.error('Supabase registration failed:', error.code || error.status || 'unknown error');
            return res.status(502).json({ message: 'No se pudo crear la cuenta en Supabase.' });
        }

        if (!data.user) {
            return res.status(502).json({ message: 'Supabase no devolvió el usuario creado.' });
        }

        return res.status(201).json({
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
            },
            session: data.session,
            confirmationRequired: !data.session,
        });
    } catch (error) {
        console.error('Supabase registration request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de registro.' });
    }
});

app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = typeof req.body?.refresh_token === 'string' ? req.body.refresh_token : '';
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se recibió el token de renovación.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de autenticación no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

        if (error || !data.session) {
            return res.status(401).json({ message: 'La sesión expiró. Inicia sesión de nuevo.' });
        }

        return res.json({ session: data.session });
    } catch (error) {
        console.error('Supabase session refresh failed:', error.message);
        return res.status(502).json({ message: 'No se pudo renovar la sesión.' });
    }
});

// Iniciar servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});