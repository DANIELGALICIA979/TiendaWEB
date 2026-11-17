import { useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import RequestState from '../components/RequestState.jsx'
import { useCart } from '../components/useCart.js'
import { procesarCompra } from '../services/api.js'

function formatPrice(price) {
  const amount = Number(price)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount)
    : 'No disponible'
}

function hasValidPrice(price) {
  return price !== undefined && price !== null && price !== '' && Number.isFinite(Number(price))
}

function CarritoCompras() {
  const { items, loading: cartLoading, error: cartError, updateQuantity, removeFromCart, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.product.price)
    return total + (hasValidPrice(item.product.price) ? price * item.quantity : 0)
  }, 0)
  const canCheckout = items.length > 0 && items.every(item =>
    item.product.id !== undefined && hasValidPrice(item.product.price),
  )

  const handleCheckout = async event => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setCheckoutLoading(true)
    try {
      await procesarCompra(items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })), { paymentMethod })
      clearCart()
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <Navbar active="/carrito" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-space-lg px-space-md py-space-xl lg:px-space-xl">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Tu selección</p>
          <h1 className="mt-1 font-headline-xl text-headline-xl font-extrabold">Carrito de Compras</h1>
        </div>
        {cartLoading
          ? <RequestState loading />
          : cartError && <RequestState error={cartError} />}
        {error && <RequestState error={error} />}
        {success && <p className="rounded border border-secondary-fixed bg-[#0a2318] p-4 text-secondary-fixed" role="status">Compra procesada correctamente.</p>}
        {!cartLoading && !cartError && items.length === 0
          ? <RequestState empty emptyMessage="Tu carrito está vacío." />
          : !cartLoading && !cartError && (
            <div className="grid gap-space-lg lg:grid-cols-[1fr_360px]">
              <section className="space-y-space-md">
                {items.map(({ product, quantity }) => (
                  <article className="flex flex-col gap-space-md rounded-xl border border-outline-variant bg-surface-container-low p-space-md sm:flex-row sm:items-center" key={product.id}>
                    <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-highest sm:w-32">
                      {product.imageUrl
                        ? <img alt={product.title || 'Producto'} className="h-full w-full object-cover" src={product.imageUrl} />
                        : <span aria-hidden="true" className="material-symbols-outlined text-3xl text-outline">stadia_controller</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-headline-sm text-headline-sm">{product.title}</h2>
                      {product.platform && <p className="mt-1 font-label-sm text-label-sm text-outline">{product.platform}</p>}
                      <p className="mt-2 font-label-md text-label-md text-primary-container">{formatPrice(product.price)} por unidad</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button aria-label={`Reducir cantidad de ${product.title}`} className="rounded border border-outline-variant px-3 py-1 hover:border-primary-container" onClick={() => updateQuantity(product.id, quantity - 1)} type="button">−</button>
                      <span aria-label="Cantidad" className="min-w-6 text-center font-label-md text-label-md">{quantity}</span>
                      <button aria-label={`Aumentar cantidad de ${product.title}`} className="rounded border border-outline-variant px-3 py-1 hover:border-primary-container" onClick={() => updateQuantity(product.id, quantity + 1)} type="button">+</button>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="font-headline-sm text-headline-sm font-bold text-primary-container">{formatPrice(Number(product.price) * quantity)}</p>
                      <button className="mt-1 font-label-sm text-label-sm text-error hover:underline" onClick={() => removeFromCart(product.id)} type="button">Eliminar</button>
                    </div>
                  </article>
                ))}
              </section>
              <aside className="h-fit space-y-space-md rounded-xl border border-outline-variant bg-surface-container-low p-space-lg">
                <h2 className="font-headline-md text-headline-md font-semibold">Resumen de Compra</h2>
                <div className="flex justify-between border-b border-outline-variant/60 pb-space-md font-body-md text-body-md text-on-surface-variant">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="space-y-2">
                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Método de pago</p>
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-outline-variant p-3">
                    <input checked={paymentMethod === 'tarjeta'} className="accent-cyan-400" name="paymentMethod" onChange={() => setPaymentMethod('tarjeta')} type="radio" value="tarjeta" />
                    <span>Tarjeta de crédito o débito</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-outline-variant p-3">
                    <input checked={paymentMethod === 'paypal'} className="accent-cyan-400" name="paymentMethod" onChange={() => setPaymentMethod('paypal')} type="radio" value="paypal" />
                    <span>PayPal</span>
                  </label>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md font-bold">
                  <span>Total</span><span className="text-primary-container">{formatPrice(subtotal)}</span>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-4 py-3 font-label-md text-label-md font-bold uppercase text-surface-container-lowest transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!canCheckout || checkoutLoading} onClick={handleCheckout} type="button">
                  {checkoutLoading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                  {checkoutLoading ? 'Procesando...' : 'Finalizar Compra'}
                </button>
                {!canCheckout && <p className="font-body-sm text-body-sm text-outline">Se requiere un identificador y un precio válido por producto para continuar.</p>}
                <p className="flex items-center justify-center gap-1 font-label-sm text-label-sm text-secondary-fixed">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  Pago seguro y protegido
                </p>
              </aside>
            </div>
          )}
      </main>
      <Footer />
    </div>
  )
}

export default CarritoCompras
