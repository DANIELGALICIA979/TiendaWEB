import { useEffect, useMemo, useRef, useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo } from '../src/catalogUtils.js'
import useCart from '../src/useCart.js'
import { confirmarCompra, limpiarSolicitudCompra } from '../services/api.js'

function moneda(amount, currency = 'MXN') {
  return formatoPrecio(amount, currency)
}

function ShoppingCart() {
  const { catalog, retry } = useCatalogData()
  const { items, error: cartError, addItem, updateQuantity, removeItem, clearCart } = useCart()
  const [couponApplied, setCouponApplied] = useState(true)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const processedRequest = useRef('')
  const checkoutInProgress = useRef(false)

  const params = new URLSearchParams(window.location.search)
  const productSlug = params.get('product')
  const game = catalog.games.find(item => item.slug === productSlug)
  const gameOffers = game?.offers || []
  const requestedEdition = params.get('edition')
  const requestedPlatform = params.get('platform')
  const requestedRegion = params.get('region')
  const offer = gameOffers.find(item => (
    String(item.id) === requestedEdition || item.edition === requestedEdition
  )) || gameOffers.find(item => (
    nombreCatalogo(item.platform) === requestedPlatform
    && nombreCatalogo(item.region) === requestedRegion
  )) || gameOffers[0]
  const cartItem = useMemo(() => game && offer ? {
    id: `${game.id}:${offer.id}`,
    offerId: String(offer.id),
    name: game.title,
    platform: nombreCatalogo(offer.platform) || 'Plataforma no especificada',
    delivery: 'ENTREGA INMEDIATA',
    format: nombreCatalogo(offer.region) || 'LICENCIA DIGITAL',
    description: game.description || offer.edition || '',
    price: Number(offer.price),
    previousPrice: Number(offer.original_price) > Number(offer.price)
      ? Number(offer.original_price)
      : null,
    currency: offer.currency,
    image: game.cover_url || game.banner_url,
    accent: 'cyan',
  } : null, [game, offer])
  const notice = catalog.status === 'ready' && productSlug && (!game || !cartItem)
    ? 'No se encontró una oferta disponible para este juego.'
    : ''

  useEffect(() => {
    if (catalog.status !== 'ready' || !productSlug) {
      return
    }

    if (!game || !cartItem) {
      return
    }

    const request = window.location.search
    if (processedRequest.current === request) {
      return
    }
    processedRequest.current = request

    if (addItem(cartItem)) {
      window.history.replaceState({}, '', '/carrito')
    } else {
      processedRequest.current = ''
    }
  }, [addItem, cartItem, catalog.status, game, productSlug])

  const currency = 'MXN'
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const discount = couponApplied ? subtotal * 0.15 : 0
  const total = subtotal - discount

  async function finalizarCompra() {
    if (checkoutInProgress.current) {
      return
    }

    checkoutInProgress.current = true
    setCheckoutLoading(true)
    setCheckoutError('')

    try {
      const order = await confirmarCompra(items, couponApplied ? 'GAMER2025' : null)
      if (!clearCart()) {
        setCheckoutError('La orden se creó, pero no se pudo limpiar el carrito. Vuelve a finalizar para recuperar la misma orden.')
        return
      }

      limpiarSolicitudCompra()
      window.location.assign(`/pedido-confirmacion?order=${encodeURIComponent(order.id)}`)
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      checkoutInProgress.current = false
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="shopping-cart">

      <main className="cart-main" id="carrito">
        {catalog.status === 'error' && <p className="checkout-notice" role="alert">{catalog.message} <button type="button" className="text-button" onClick={retry}>Reintentar</button></p>}
        {cartError && <p className="checkout-notice" role="alert">{cartError}</p>}
        {catalog.status === 'loading' && <p role="status">Cargando catálogo...</p>}
        {notice && <p className="checkout-notice" role="status">{notice}</p>}
        <div className="cart-heading">
          <div>
            <p className="live-status"><span /> Protocolo de Despacho Neural Activo</p>
            <h1>Carrito</h1>
          </div>
          <button
            type="button"
            className="text-button delete-all"
            onClick={clearCart}
            disabled={items.length === 0 && !cartError}
          >
            <span className="material-symbols-outlined" aria-hidden="true">delete_sweep</span>
            Vaciar Carro
          </button>
        </div>

        <div className="cart-layout">
          <section className="cart-items" aria-label="Productos en el carrito">
            <div className="items-heading">
              <span>{itemCount} {itemCount === 1 ? 'LICENCIA DIGITAL SELECCIONADA' : 'LICENCIAS DIGITALES SELECCIONADAS'}</span>
              {items.length > 0 && <span className="stock-warning">ÚLTIMAS CLAVES EN STOCK</span>}
            </div>

            {items.length > 0 ? (
              items.map((item) => (
                <article className={`product-card accent-${item.accent}`} key={item.id}>
                  {item.image && <img className="product-image" src={item.image} alt={`Portada de ${item.name}`} />}
                  <div className="product-content">
                    <div className="product-topline">
                      <div className="product-tags">
                        <span className="platform-tag">{item.platform}</span>
                        <span className="delivery-tag">{item.delivery}</span>
                        <span className="format-tag">{item.format}</span>
                      </div>
                      <div className="product-price">
                        <strong>{moneda(item.price, item.currency)}</strong>
                        {item.previousPrice && <del>{moneda(item.previousPrice, item.currency)}</del>}
                      </div>
                    </div>
                    <h2>{item.name}</h2>
                    <p className="product-description">{item.description}</p>
                    <div className="product-controls">
                      <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
                        <button
                          type="button"
                          aria-label="Reducir cantidad"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">remove</span>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">add</span>
                        </button>
                      </div>
                      <button type="button" className="text-button save-button">
                        <span className="material-symbols-outlined" aria-hidden="true">bookmark</span>
                        Guardar
                      </button>
                      <button type="button" className="text-button remove-button" onClick={() => removeItem(item.id)}>
                        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-cart">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
                <h2>Tu carrito está vacío</h2>
                <p>Agrega una licencia para continuar con tu compra.</p>
              </div>
            )}

            <section className="coupon-card" aria-label="Cupón de descuento">
              <div className="coupon-copy">
                <span className="material-symbols-outlined coupon-icon" aria-hidden="true">sell</span>
                <div>
                  <h2>Cupón de Descuento Cyber</h2>
                  <p>{couponApplied ? 'Código de temporada VIP activo sobre el total.' : 'El cupón GAMER2025 fue retirado.'}</p>
                </div>
              </div>
              {couponApplied ? (
                <div className="coupon-code">
                  <span>GAMER2025</span>
                  <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                  <button type="button" aria-label="Quitar cupón" onClick={() => setCouponApplied(false)}>
                    <span className="material-symbols-outlined" aria-hidden="true">close</span>
                  </button>
                </div>
              ) : (
                <button type="button" className="button button-outline" onClick={() => setCouponApplied(true)}>
                  Aplicar cupón
                </button>
              )}
            </section>

            <aside className="vault-banner">
              <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
              <div>
                <h2>Desbloqueo Inmediato en Tu Bóveda Personal</h2>
                <p>Al finalizar la compra simulada, las keys disponibles se asignarán a tu perfil.</p>
              </div>
            </aside>
          </section>

          <aside className="order-summary" aria-label="Resumen de orden">
            <div className="summary-accent" />
            <div className="summary-heading">
              <h2>Resumen de Orden</h2>
              <span>{itemCount} PRODUCTOS</span>
            </div>
            <div className="summary-lines">
              <div><span>Subtotal del Carro</span><strong>{moneda(subtotal, currency)}</strong></div>
              <div className="discount-line"><span>Descuento Promocional (15%)</span><strong>-{moneda(discount, currency)}</strong></div>
              <div><span>Impuestos Digitales (IVA 0%)</span><strong>{moneda(0, currency)}</strong></div>
              <div><span>Costo de envío</span><strong className="free-shipping">GRATIS</strong></div>
            </div>
            <div className="total-panel">
              <div><span>TOTAL A PAGAR</span><span>ESTADO: LISTO</span></div>
              <strong>{moneda(total, currency)}</strong>
              <p>{couponApplied ? `Ahorraste ${moneda(discount, currency)} (Oferta Flash)` : 'Descuento no aplicado'}</p>
            </div>

            <div className="payment-preview">
              <p><span className="material-symbols-outlined" aria-hidden="true">verified</span> COMPRA ACADÉMICA SIMULADA</p>
              <small>No se solicitarán datos bancarios. Al confirmar, la orden se registrará y se asignarán las keys disponibles.</small>
            </div>

            <div className="checkout-action">
              <button
                type="button"
                className="checkout-button"
                disabled={items.length === 0 || checkoutLoading}
                onClick={finalizarCompra}
              >
                <span className="material-symbols-outlined" aria-hidden="true">{checkoutLoading ? 'sync' : 'bolt'}</span>
                {checkoutLoading ? 'Procesando compra...' : 'Finalizar compra simulada'}
              </button>
              {checkoutError && <p className="checkout-notice" role="alert">{checkoutError}</p>}
              <p>La simulación registrará el pago como aprobado; no se realizará ningún cobro.</p>
            </div>
            <div className="security-note">
              <p><span className="material-symbols-outlined" aria-hidden="true">verified</span> Garantía de Activación 100%</p>
              <p><span className="material-symbols-outlined" aria-hidden="true">key</span> Acceso a tus licencias en Nexus Digital Vault.</p>
            </div>
          </aside>
        </div>

        <section className="license-preview">
          <div className="license-heading">
            <div>
              <span>ENTREGA AUTOMÁTICA</span>
              <h2>Tus keys aparecerán en tu biblioteca</h2>
            </div>
            <span className="ready-indicator">INVENTARIO VALIDADO AL COMPRAR</span>
          </div>
          <p>La asignación se realiza en la base de datos. Consulta y copia las keys entregadas desde <a href="/claves">Mi Bóveda</a>.</p>
        </section>
      </main>

    </div>
  )
}

export default ShoppingCart
