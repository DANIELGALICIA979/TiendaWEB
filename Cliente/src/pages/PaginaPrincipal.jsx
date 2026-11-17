import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { obtenerProductos } from '../services/api.js'

const benefits = [
  { icon: 'forward_to_inbox', title: 'Entrega Inmediata', description: 'Recepción ultraveloz en tu cuenta.' },
  { icon: 'verified_user', title: 'Claves Legítimas', description: 'Suministradas por distribuidores autorizados.' },
  { icon: 'security', title: 'Pagos Seguros SSL', description: 'Cifrado seguro para proteger tus transacciones.' },
  { icon: 'support_agent', title: 'Soporte', description: 'Ayuda para gestionar tus licencias.' },
]

function PaginaPrincipal() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = useCallback(async () => {
    try {
      const result = await obtenerProductos()
      if (!Array.isArray(result)) throw new Error('La respuesta del catálogo no tiene el formato esperado.')
      setProducts(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const retryProducts = () => {
    setLoading(true)
    setError(null)
    loadProducts()
  }

  const featuredProduct = products[0]

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <Navbar active="/" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-space-xl px-space-md py-space-lg lg:px-space-xl">
        <section className="relative overflow-hidden rounded-xl border border-primary-container/30 bg-surface-container-low shadow-[0_0_24px_rgba(0,240,255,0.1)]">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="grid min-h-[300px] lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-space-md p-space-lg lg:p-space-xl">
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-container">
                <span aria-hidden="true" className="material-symbols-outlined">verified_user</span>
                Neural Key Vault
              </div>
              <h1 className="font-headline-xl text-headline-xl font-extrabold uppercase tracking-tight text-white">
                Videojuegos <span className="text-primary-container">Digitales</span>
              </h1>
              <p className="max-w-xl text-on-surface-variant">
                Explora el catálogo, encuentra tu próxima aventura y gestiona tus licencias digitales desde un solo lugar.
              </p>
              <Link className="inline-flex w-fit items-center gap-2 rounded bg-primary-container px-5 py-3 font-label-md text-label-md font-bold uppercase text-surface-container-lowest transition hover:bg-primary" to="/catalogo">
                <span className="material-symbols-outlined">sports_esports</span>
                Explorar catálogo
              </Link>
            </div>
            <div className="flex items-center justify-center border-t border-outline-variant/50 bg-gradient-to-br from-primary-container/10 via-purple-900/20 to-surface-container-low p-space-lg lg:border-l lg:border-t-0">
              {loading
                ? <RequestState loading />
                : error
                  ? <RequestState error={error} onRetry={retryProducts} />
                  : featuredProduct
                    ? (
                      <div className="w-full max-w-sm">
                        <p className="mb-3 font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Producto destacado</p>
                        <ProductCard product={featuredProduct} />
                      </div>
                    )
                    : <p className="text-center text-on-surface-variant">No hay productos destacados disponibles.</p>}
            </div>
          </div>
        </section>

        <section className="grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(benefit => (
            <article className="flex items-start gap-space-sm rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-space-md" key={benefit.title}>
              <span aria-hidden="true" className="material-symbols-outlined rounded bg-surface-container p-2 text-2xl text-primary-container">{benefit.icon}</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-semibold">{benefit.title}</h2>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{benefit.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section>
          <div className="mb-space-md flex items-end justify-between gap-space-md">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Descubre</p>
              <h2 className="mt-1 font-headline-lg text-headline-lg font-bold">Productos disponibles</h2>
            </div>
            <Link className="font-label-sm text-label-sm text-primary-container hover:underline" to="/catalogo">Ver catálogo</Link>
          </div>
          <RequestState empty={!loading && !error && products.length === 0} emptyMessage="No hay productos disponibles." error={error} loading={loading} onRetry={retryProducts} />
          {!loading && !error && products.length > 0 && (
            <div className="grid gap-space-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PaginaPrincipal
