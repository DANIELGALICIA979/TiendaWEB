import { useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo } from '../src/catalogUtils.js'

const paymentMethods = [
  { id: 'card', icon: 'credit_card', name: 'Tarjeta de Crédito / Débito', note: 'Visa, Master, Amex' },
  { id: 'paypal', icon: 'account_balance_wallet', name: 'PayPal', note: 'Saldo o cuentas vinculadas' },
  { id: 'crypto', icon: 'currency_bitcoin', name: 'Cripto (USDT / BTC)', note: 'Red TRC20, BSC, Polygon' },
  { id: 'transfer', icon: 'payments', name: 'Transferencia Rápida', note: 'SPEI, PSE, Pix, SEPA' },
]

function moneda(amount, currency = 'MXN') {
  return formatoPrecio(amount, currency)
}

function ShoppingCart() {
  const { catalog, retry } = useCatalogData()
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState(false)
  const [couponApplied, setCouponApplied] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [copyMessage, setCopyMessage] = useState('')

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
  const cartItem = game && offer ? {
    id: game.id,
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
    quantity,
    image: game.cover_url || game.banner_url,
    accent: 'cyan',
  } : null
  const items = cartItem && !removed ? [cartItem] : []
  const notice = catalog.status === 'ready' && productSlug && !cartItem
    ? 'No se encontró una oferta disponible para este juego.'
    : ''

  const currency = items[0]?.currency || 'MXN'
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const discount = couponApplied ? subtotal * 0.15 : 0
  const total = subtotal - discount

  function changeQuantity(id, amount) {
    if (id === cartItem?.id) {
      setQuantity(currentQuantity => Math.max(1, currentQuantity + amount))
    }
  }

  function removeItem(id) {
    if (id === cartItem?.id) {
      setRemoved(true)
    }
  }

  async function copyLicense() {
    try {
      await navigator.clipboard.writeText('NX89-DEMO-2025-VLT9')
      setCopyMessage('Licencia copiada.')
    } catch (error) {
      setCopyMessage(`No se pudo copiar la licencia: ${error.message}`)
    }
  }

  return (
    <div className="shopping-cart">

      <main className="cart-main" id="carrito">
        {catalog.status === 'error' && <p className="checkout-notice" role="alert">{catalog.message} <button type="button" className="text-button" onClick={retry}>Reintentar</button></p>}
        {catalog.status === 'loading' && <p role="status">Cargando catálogo...</p>}
        <div className="cart-heading">
          <div>
            <p className="live-status"><span /> Protocolo de Despacho Neural Activo</p>
            <h1>Carrito</h1>
          </div>
          <button
            type="button"
            className="text-button delete-all"
            onClick={() => {
              setRemoved(true)
            }}
            disabled={items.length === 0}
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
                  <img className="product-image" src={item.image} alt={`Portada de ${item.name}`} />
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
                          onClick={() => changeQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">remove</span>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() => changeQuantity(item.id, 1)}
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
                <p>En una compra real, tus códigos estarían disponibles en tu perfil de Nexus Vault.</p>
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

            <fieldset className="payment-selector">
              <legend>Seleccionar Método de Pago</legend>
              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <button
                    type="button"
                    className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                    key={method.id}
                    aria-pressed={paymentMethod === method.id}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">{method.icon}</span>
                    <strong>{method.name}</strong>
                    <small>{method.note}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            {paymentMethod === 'card' && (
              <div className="payment-preview">
                <p><span className="material-symbols-outlined" aria-hidden="true">lock</span> DATOS CIFRADOS DE TRANSACCIÓN</p>
                <input aria-label="Número de tarjeta de ejemplo" placeholder="Número de Tarjeta (•••• •••• •••• 4242)" autoComplete="cc-number" />
                <div>
                  <input aria-label="Vencimiento de tarjeta de ejemplo" placeholder="MM / AA" autoComplete="cc-exp" />
                  <input aria-label="CVC de ejemplo" placeholder="CVC / CVV" type="password" autoComplete="cc-csc" />
                </div>
                <small>Vista de demostración: los pagos todavía no están configurados.</small>
              </div>
            )}

            <div className="checkout-action">
              <button
                type="button"
                className="checkout-button"
                disabled={items.length === 0}
                onClick={() => window.location.assign('/pedido-confirmacion')}
              >
                <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                Ver confirmación de demostración
              </button>
              {notice && <p className="checkout-notice" role="status">{notice}</p>}
              <p>El flujo es demostrativo: no se procesará ningún pago.</p>
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
              <span>SIMULACIÓN DE DESPACHO EN VIVO</span>
              <h2>¿Cómo verás tus licencias tras la compra?</h2>
            </div>
            <span className="ready-indicator">NODO LISTO PARA INYECCIÓN</span>
          </div>
          <div className="license-key">
            <span className="material-symbols-outlined key-icon" aria-hidden="true">vpn_key</span>
            <div>
              <span>VOUCHER TEST NEURAL // {items[0]?.name || 'SIN PRODUCTO'}</span>
              <strong>NX89-DEMO-2025-VLT9</strong>
              <small>Región: {items[0]?.format || 'N/D'} • Plataforma: {items[0]?.platform || 'N/D'}</small>
            </div>
            <button type="button" className="button button-primary" onClick={copyLicense}>
              <span className="material-symbols-outlined" aria-hidden="true">content_copy</span>
              Copiar licencia
            </button>
          </div>
          {copyMessage && <p className="copy-message" role="status">{copyMessage}</p>}
        </section>
      </main>

    </div>
  )
}

export default ShoppingCart
