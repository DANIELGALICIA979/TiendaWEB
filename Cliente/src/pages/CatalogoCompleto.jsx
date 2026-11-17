import { useCallback, useEffect, useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { obtenerProductos } from '../services/api.js'

const platforms = ['Todos', 'Steam', 'PlayStation 5', 'Xbox Series', 'Nintendo Switch', 'PC / GOG / Epic']
const categories = ['Acción', 'Aventura', 'Estrategia', 'RPG', 'Simulación']
const priceRanges = [
  { label: 'Menos de $10', value: '0-10' },
  { label: '$10 - $30', value: '10-30' },
  { label: '$30 - $60', value: '30-60' },
  { label: 'Más de $60', value: '60+' },
]

function CatalogoCompleto() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activePlatform, setActivePlatform] = useState('Todos')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])

  const loadProducts = useCallback(async () => {
    try {
      const result = await obtenerProductos({
        platform: activePlatform === 'Todos' ? undefined : activePlatform,
        search: search || undefined,
        category: selectedCategories,
        priceRange: selectedPriceRanges,
      })
      if (!Array.isArray(result)) throw new Error('La respuesta del catálogo no tiene el formato esperado.')
      setProducts(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [activePlatform, search, selectedCategories, selectedPriceRanges])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const toggleSelection = (value, selected, setSelected) => {
    setLoading(true)
    setError(null)
    setSelected(current => selected
      ? current.filter(item => item !== value)
      : [...current, value])
  }

  const applySearch = event => {
    event.preventDefault()
    const nextSearch = searchInput.trim()
    if (nextSearch !== search) {
      setLoading(true)
      setError(null)
      setSearch(nextSearch)
    }
  }

  const selectPlatform = platform => {
    if (platform === activePlatform) return
    setLoading(true)
    setError(null)
    setActivePlatform(platform)
  }

  const retryProducts = () => {
    setLoading(true)
    setError(null)
    loadProducts()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <Navbar active="/catalogo" />
      <section className="border-b border-outline-variant/60 bg-surface-container-lowest/80">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-space-md py-space-sm lg:px-space-xl">
          <span className="mr-2 flex shrink-0 items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-outline">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">tune</span> Filtros:
          </span>
          {platforms.map(platform => (
            <button aria-pressed={activePlatform === platform} className={`shrink-0 rounded-full border px-3 py-1 font-label-sm text-label-sm uppercase transition ${activePlatform === platform ? 'border-primary-container bg-primary-container text-surface-container-lowest' : 'border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container'}`} key={platform} onClick={() => selectPlatform(platform)} type="button">
              {platform}
            </button>
          ))}
        </div>
      </section>
      <main className="mx-auto w-full max-w-7xl flex-1 px-space-md py-space-lg lg:px-space-xl">
        <header className="mb-space-lg flex flex-col gap-space-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Nexus Keys Vault</p>
            <h1 className="mt-1 font-headline-xl text-headline-xl font-extrabold">Catálogo Global</h1>
            <p className="mt-2 text-on-surface-variant">Encuentra videojuegos y licencias digitales para tu plataforma.</p>
          </div>
          <form className="flex w-full gap-2 sm:max-w-sm" onSubmit={applySearch}>
            <input aria-label="Buscar productos" className="min-w-0 flex-1 rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface outline-none focus:border-primary-container" onChange={event => setSearchInput(event.target.value)} placeholder="Buscar videojuegos..." type="search" value={searchInput} />
            <button className="rounded bg-primary-container px-4 py-2 font-label-md text-label-md font-bold text-surface-container-lowest hover:bg-primary" type="submit">Buscar</button>
          </form>
        </header>
        <div className="grid gap-space-lg lg:grid-cols-[230px_1fr]">
          <aside className="h-fit space-y-space-lg rounded-xl border border-outline-variant bg-surface-container-low p-space-md">
            <section>
              <h2 className="mb-3 font-label-md text-label-md font-bold uppercase tracking-wider">Rango de Precio</h2>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label className="flex cursor-pointer items-center gap-2 font-body-sm text-body-sm text-on-surface-variant" key={range.value}>
                    <input checked={selectedPriceRanges.includes(range.value)} className="accent-cyan-400" onChange={() => toggleSelection(range.value, selectedPriceRanges.includes(range.value), setSelectedPriceRanges)} type="checkbox" />
                    {range.label}
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-3 font-label-md text-label-md font-bold uppercase tracking-wider">Categoría</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <label className="flex cursor-pointer items-center gap-2 font-body-sm text-body-sm text-on-surface-variant" key={category}>
                    <input checked={selectedCategories.includes(category)} className="accent-cyan-400" onChange={() => toggleSelection(category, selectedCategories.includes(category), setSelectedCategories)} type="checkbox" />
                    {category}
                  </label>
                ))}
              </div>
            </section>
          </aside>
          <section aria-label="Productos">
            <RequestState empty={!loading && !error && products.length === 0} emptyMessage="No hay productos disponibles con estos filtros." error={error} loading={loading} onRetry={retryProducts} />
            {!loading && !error && products.length > 0 && (
              <>
                <p className="mb-space-md font-label-sm text-label-sm text-outline">{products.length} productos disponibles</p>
                <div className="grid gap-space-md sm:grid-cols-2 xl:grid-cols-3">
                  {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CatalogoCompleto
