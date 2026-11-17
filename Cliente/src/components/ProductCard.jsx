import { useState } from 'react'
import { useCart } from './useCart.js'

function formatPrice(price) {
  const amount = Number(price)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount)
    : 'Precio no disponible'
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(null)

  const handleAdd = () => {
    if (product.id === undefined || product.id === null) {
      setError('El producto recibido no tiene identificador.')
      return
    }
    if (product.price === undefined || product.price === null || product.price === '' || !Number.isFinite(Number(product.price))) {
      setError('Este producto no tiene un precio válido.')
      return
    }
    if (!addToCart(product)) return
    setError(null)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-low transition hover:border-primary-container/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-surface-container-highest">
        {product.imageUrl
          ? <img alt={product.title || 'Producto'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.imageUrl} />
          : <span aria-hidden="true" className="material-symbols-outlined text-5xl text-outline">stadia_controller</span>}
        {product.platform && <span className="absolute right-2 top-2 rounded-full bg-surface-container-lowest/90 px-2 py-1 font-label-sm text-label-sm text-primary-container">{product.platform}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-space-md">
        {product.category && <p className="font-body-sm text-body-sm text-outline">{product.category}</p>}
        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-headline-md text-headline-md font-bold text-primary-container">{formatPrice(product.price)}</span>
          <button className="rounded bg-primary-container px-3 py-2 font-label-md text-label-md font-bold text-surface-container-lowest transition hover:bg-primary" onClick={handleAdd} type="button">
            <span className="material-symbols-outlined mr-1 text-base">shopping_cart</span>
            {added ? 'Añadido' : 'Añadir'}
          </button>
        </div>
        {error && <p className="font-body-sm text-body-sm text-error" role="alert">{error}</p>}
      </div>
    </article>
  )
}

export default ProductCard
