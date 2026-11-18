import { useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo } from '../src/catalogUtils.js'
import SiteHeader from '../src/SiteHeader.jsx'
import SiteFooter from '../src/SiteFooter.jsx'

function descuentoPorcentaje(offer) {
  const originalPrice = Number(offer?.original_price)
  const price = Number(offer?.price)
  return originalPrice > price
    ? Math.round((originalPrice - price) / originalPrice * 100)
    : 0
}

function cambiarSeleccion(selection, value) {
  return selection.includes(value)
    ? selection.filter(item => item !== value)
    : [...selection, value]
}

function GameCatalog({ user, onSignOut }) {
  const [priceFloor, setPriceFloor] = useState(0)
  const [priceLimit, setPriceLimit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [selectedDrms, setSelectedDrms] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [availability, setAvailability] = useState([])
  const [discountOnly, setDiscountOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState('offers')
  const [viewMode, setViewMode] = useState('grid')
  const [pageSize, setPageSize] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const { catalog, retry } = useCatalogData()
  const allOffers = catalog.games.flatMap(game => game.offers || [])
  const platformOptions = [...new Set(allOffers.map(offer => nombreCatalogo(offer.platform)).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
  const drmOptions = [...new Set(allOffers.map(offer => nombreCatalogo(offer.drm)).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
  const regionOptions = [...new Map(allOffers
    .map(offer => offer.region)
    .filter(region => region?.code && region.name)
    .map(region => [region.code, region])).values()]
    .sort((first, second) => first.name.localeCompare(second.name))
  const categoryOptions = [...new Set(catalog.games.flatMap(game => (
    (game.categories || []).map(nombreCatalogo).filter(Boolean)
  )))].sort((first, second) => first.localeCompare(second))
  const highestPrice = Math.max(1000, ...allOffers.map(offer => Number(offer.price) || 0))
  const priceSliderMax = Math.ceil(highestPrice / 100) * 100

  const filteredGames = catalog.games.flatMap(game => {
    const searchable = [
      game.title,
      game.developer,
      game.publisher,
      game.franchise,
      game.description,
      game.slug,
      ...(game.categories || []).map(nombreCatalogo),
      ...(game.offers || []).flatMap(offer => [
        nombreCatalogo(offer.platform),
        nombreCatalogo(offer.region),
        nombreCatalogo(offer.drm),
      ]),
    ].join(' ').toLowerCase()
    const matchesSearch = searchable.includes(searchTerm.toLowerCase())
    const gameCategories = (game.categories || []).map(nombreCatalogo)
    const matchesCategory = !selectedCategories.length
      || selectedCategories.some(category => gameCategories.includes(category))
    if (!matchesSearch || !matchesCategory) {
      return []
    }

    const matchingOffers = (game.offers || []).filter(offer => {
      const platform = nombreCatalogo(offer.platform)
      const drm = nombreCatalogo(offer.drm)
      const region = offer.region?.code || ''
      const price = Number(offer.price)
      const matchesPlatform = !selectedPlatforms.length || selectedPlatforms.includes(platform)
      const matchesDrm = !selectedDrms.length || selectedDrms.includes(drm)
      const matchesRegion = !selectedRegion || selectedRegion === region
      const matchesPrice = price >= priceFloor && (priceLimit === null || price <= priceLimit)
      const isPreorder = /pre[\s-]?order|preventa/i.test(offer.delivery_type || '')
      const matchesAvailability = !availability.length || availability.some(type => (
        type === 'preorder' ? isPreorder : !isPreorder
      ))
      const startsAt = offer.promotion_starts_at ? Date.parse(offer.promotion_starts_at) : null
      const endsAt = offer.promotion_ends_at ? Date.parse(offer.promotion_ends_at) : null
      const promotionIsActive = (startsAt === null || startsAt <= Date.now())
        && (endsAt === null || endsAt >= Date.now())
      const matchesDiscount = !discountOnly
        || (descuentoPorcentaje(offer) > 20 && promotionIsActive)

      return matchesPlatform && matchesDrm && matchesRegion && matchesPrice
        && matchesAvailability && matchesDiscount
    })
    if (!matchingOffers.length) {
      return []
    }

    const offersByPrice = [...matchingOffers].sort((first, second) => Number(first.price) - Number(second.price))
    const offer = sortOrder === 'discount'
      ? [...matchingOffers].sort((first, second) => descuentoPorcentaje(second) - descuentoPorcentaje(first))[0]
      : offersByPrice[0]
    return [{ game, offer, matchingOffers }]
  })

  const games = [...filteredGames].sort((first, second) => {
    if (sortOrder === 'price_low') {
      return Number(first.offer.price) - Number(second.offer.price)
    }
    if (sortOrder === 'discount') {
      return descuentoPorcentaje(second.offer) - descuentoPorcentaje(first.offer)
    }
    if (sortOrder === 'recent') {
      return (Date.parse(second.game.release_date || '') || 0) - (Date.parse(first.game.release_date || '') || 0)
    }
    if (sortOrder === 'title') {
      return first.game.title.localeCompare(second.game.title)
    }
    return second.matchingOffers.length - first.matchingOffers.length
  })

  const totalPages = Math.max(1, Math.ceil(games.length / pageSize))
  const visibleGames = games.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function updateFilter(update) {
    setCurrentPage(1)
    update()
  }

  const activeFilters = [
    ...selectedPlatforms.map(platform => ({
      key: `platform-${platform}`,
      label: platform,
      remove: () => updateFilter(() => setSelectedPlatforms(selection => selection.filter(item => item !== platform))),
    })),
    ...selectedDrms.map(drm => ({
      key: `drm-${drm}`,
      label: drm,
      remove: () => updateFilter(() => setSelectedDrms(selection => selection.filter(item => item !== drm))),
    })),
    ...(selectedRegion ? [{
      key: `region-${selectedRegion}`,
      label: regionOptions.find(region => region.code === selectedRegion)?.name || selectedRegion,
      remove: () => updateFilter(() => setSelectedRegion('')),
    }] : []),
    ...selectedCategories.map(category => ({
      key: `category-${category}`,
      label: category,
      remove: () => updateFilter(() => setSelectedCategories(selection => selection.filter(item => item !== category))),
    })),
    ...availability.map(type => ({
      key: `availability-${type}`,
      label: type === 'preorder' ? 'Preventas' : 'Stock inmediato',
      remove: () => updateFilter(() => setAvailability(selection => selection.filter(item => item !== type))),
    })),
    ...(discountOnly ? [{
      key: 'discount',
      label: 'Descuento activo >20%',
      remove: () => updateFilter(() => setDiscountOnly(false)),
    }] : []),
    ...((priceFloor > 0 || priceLimit !== null) ? [{
      key: 'price',
      label: `Precio: $${priceFloor}–${priceLimit === null ? '+' : `$${priceLimit}`} MXN`,
      remove: () => updateFilter(() => {
        setPriceFloor(0)
        setPriceLimit(null)
      }),
    }] : []),
    ...(searchTerm ? [{
      key: 'search',
      label: `Búsqueda: ${searchTerm}`,
      remove: () => updateFilter(() => setSearchTerm('')),
    }] : []),
  ]

  function resetFilters() {
    setPriceFloor(0)
    setPriceLimit(null)
    setSearchTerm('')
    setSelectedPlatforms([])
    setSelectedDrms([])
    setSelectedRegion('')
    setSelectedCategories([])
    setAvailability([])
    setDiscountOnly(false)
    setSortOrder('offers')
    setViewMode('grid')
    setPageSize(12)
    setCurrentPage(1)
  }

  function applyQuickPrice(minimum, maximum) {
    updateFilter(() => {
      setPriceFloor(minimum)
      setPriceLimit(maximum)
    })
  }

  return (
    <>
      <style>{`@layer base {
      html {
        overscroll-behavior: none;
      }
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    .cyber-grid {
      background-size: 32px 32px;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    }`}</style>
      <div className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-surface-container-lowest min-h-screen flex flex-col cyber-grid">
<SiteHeader user={user} onSignOut={onSignOut} />
{/* MAIN VIEWPORT CANVAS */}
<main className="flex-grow max-w-7xl mx-auto w-full px-space-md lg:px-space-xl py-space-lg space-y-space-xl pt-16"><div className="flex flex-col w-full">
{/* AMBIENT TOP PULSE EFFECT */}
<div className="relative w-full overflow-hidden pb-space-lg">
<div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
<div className="absolute -top-20 right-10 w-80 h-80 bg-on-tertiary-container/15 rounded-full blur-3xl pointer-events-none"></div>
{/* CATALOG HEADER / CONTROL CONSOLE */}
<div className="relative z-10 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xl">
{/* Breadcrumb & Telemetry Header */}
<div className="flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container flex items-center gap-1.5">
<span className="inline-block w-1.5 h-1.5 bg-primary-container rounded-full animate-ping"></span>
            NEXUS PROTOCOL // CATALOG_NODE_V4
          </span>
<span className="text-outline font-label-sm">/</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Bóveda Global de Licencias</span>
</div>
<div className="flex items-center gap-3">
<div className="px-2 py-0.5 bg-surface-container-high rounded text-secondary-fixed-dim font-label-sm text-[10px] tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">bolt</span> LATENCIA DE ENTREGA: &lt; 2.4s
          </div>
<div className="px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant font-label-sm text-[10px]">
            RESULTADOS: <strong className="text-primary-container">{games.length} JUEGOS</strong>
</div>
</div>
</div>
{/* Live Search & Fast Query Bar */}
<div className="flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
<div className="relative flex-1">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-container">
<span className="material-symbols-outlined text-lg">search</span>
</div>
<input className="w-full pl-10 pr-24 py-3 bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline font-label-md text-label-md focus:outline-none focus:bg-surface-container transition-all" id="catalogSearch" placeholder="Buscar por título, desarrollador, franquicia o DRM (Steam, PS5, Xbox)..." type="text" value={searchTerm} onChange={(event) => updateFilter(() => setSearchTerm(event.target.value))}/>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
<span className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[10px] text-outline">ESC</span>
</div>
</div>
{/* Sort Matrix Dropdown & View Mode */}
<div className="flex items-center gap-space-sm shrink-0">
<div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl">
<span className="font-label-sm text-label-sm text-outline uppercase">Ordenar:</span>
<select className="bg-transparent font-label-md text-label-md text-primary-container font-semibold focus:outline-none cursor-pointer" value={sortOrder} onChange={(event) => updateFilter(() => setSortOrder(event.target.value))}>
<option className="bg-surface-container-lowest text-on-surface" value="offers">Más ofertas</option>
<option className="bg-surface-container-lowest text-on-surface" value="price_low">Menor Precio</option>
<option className="bg-surface-container-lowest text-on-surface" value="discount">Mayor Descuento %</option>
<option className="bg-surface-container-lowest text-on-surface" value="recent">Lanzamientos Recientes</option>
<option className="bg-surface-container-lowest text-on-surface" value="title">Título A-Z</option>
</select>
</div>
<div className="flex items-center bg-surface-container-low p-1 rounded-xl">
<button className={`p-2 rounded ${viewMode === 'grid' ? 'bg-surface-container text-primary-container shadow-sm' : 'text-outline hover:text-on-surface'}`} title="Vista de Rejilla" aria-label="Vista de rejilla" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} type="button">
<span className="material-symbols-outlined text-[18px]">grid_view</span>
</button>
<button className={`p-2 rounded ${viewMode === 'list' ? 'bg-surface-container text-primary-container shadow-sm' : 'text-outline hover:text-on-surface'}`} title="Vista de Lista" aria-label="Vista de lista" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} type="button">
<span className="material-symbols-outlined text-[18px]">view_list</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/* MAIN CATALOG WORKSPACE (2 COLUMNS: FACETED SIDEBAR + GAME CARDS GRID) */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-space-lg items-start">
{/* LEFT FACETED FILTER SIDEBAR */}
<aside className="lg:col-span-1 flex flex-col gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-xl space-y-space-md shadow-lg sticky top-20">
{/* Filter Header */}
<div className="flex items-center justify-between pb-space-sm bg-surface-container-low/40 p-2 rounded-lg">
<div className="flex items-center gap-2 text-primary-container font-headline-sm text-headline-sm uppercase">
<span className="material-symbols-outlined text-lg">tune</span>
            Filtros Neurales
          </div>
<button className="font-label-sm text-label-sm uppercase tracking-wider text-error hover:text-on-surface transition-colors" id="resetFiltersBtn" type="button" onClick={resetFilters}>
            Limpiar Todo
          </button>
</div>
{/* Facet 1: Plataforma */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Plataforma</span>
<span className="text-outline font-label-sm">{platformOptions.length}</span>
</div>
<div className="space-y-1.5 pt-1">
{platformOptions.map(platform => (
  <label key={platform} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
    <span className="flex items-center gap-2">
      <input checked={selectedPlatforms.includes(platform)} className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox" onChange={() => updateFilter(() => setSelectedPlatforms(selection => cambiarSeleccion(selection, platform)))}/>
      <span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">{platform}</span>
    </span>
    <span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">
      {catalog.games.filter(game => (game.offers || []).some(offer => nombreCatalogo(offer.platform) === platform)).length}
    </span>
  </label>
))}
</div>
</div>
{/* DRM */}
<div className="space-y-space-xs">
  <div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
    <span>DRM</span>
    <span className="text-outline font-label-sm">{drmOptions.length}</span>
  </div>
  <div className="space-y-1.5 pt-1">
    {drmOptions.map(drm => (
      <label key={drm} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
        <input checked={selectedDrms.includes(drm)} className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox" onChange={() => updateFilter(() => setSelectedDrms(selection => cambiarSeleccion(selection, drm)))}/>
        <span className="font-body-md text-body-md text-on-surface">{drm}</span>
      </label>
    ))}
  </div>
</div>
{/* Facet 2: Rango de Precio y Acceso Rápido */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Rango de Precio</span>
<span className="text-primary-container font-code-key text-code-key" id="priceDisplay">{`$${priceFloor} - ${priceLimit === null ? `${priceSliderMax}+` : priceLimit} MXN`}</span>
</div>
<div className="pt-2 px-1">
<input className="w-full accent-primary-container bg-surface-container-high h-1.5 rounded-lg cursor-pointer" id="priceSlider" max={priceSliderMax} min="0" type="range" value={priceLimit ?? priceSliderMax} onChange={(event) => {
  const maximum = Number(event.target.value)
  updateFilter(() => {
    setPriceFloor(0)
    setPriceLimit(maximum)
  })
}}/>
<div className="flex justify-between font-label-sm text-[10px] text-outline pt-1">
<span>$0</span>
<span>${Math.round(priceSliderMax / 2)}</span>
<span>${priceSliderMax}+</span>
</div>
</div>
{/* Quick Price Selectors */}
<div className="grid grid-cols-2 gap-1.5 pt-2">
{[
  { label: '< $100 MXN', minimum: 0, maximum: 100 },
  { label: '$100–$250 MXN', minimum: 100, maximum: 250 },
  { label: '$250–$500 MXN', minimum: 250, maximum: 500 },
  { label: '> $500 MXN', minimum: 500, maximum: null },
].map(range => {
  const isSelected = priceFloor === range.minimum && priceLimit === range.maximum
  return (
    <button
      key={range.label}
      className={`py-1 px-2 rounded font-label-sm text-label-sm transition-colors text-center ${isSelected ? 'bg-surface-container-high text-primary-container font-semibold' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary-container'}`}
      aria-pressed={isSelected}
      onClick={() => applyQuickPrice(range.minimum, range.maximum)}
      type="button"
    >
      {range.label}
    </button>
  )
})}
</div>
</div>
{/* Facet 3: Región de Activación */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Región de Cifrado</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">public</span> Todas las regiones
              </span>
<input checked={!selectedRegion} className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio" onChange={() => updateFilter(() => setSelectedRegion(''))}/>
</label>
{regionOptions.map(region => (
  <label key={region.code} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
    <span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
      <span className="material-symbols-outlined text-[16px] text-outline">language</span> {region.name}
    </span>
    <input checked={selectedRegion === region.code} className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio" onChange={() => updateFilter(() => setSelectedRegion(region.code))}/>
  </label>
))}
</div>
</div>
{/* Facet 4: Género / Categoría */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Género &amp; Tag</span>
</div>
<div className="flex flex-wrap gap-1.5 pt-1">
{categoryOptions.map(category => {
  const isSelected = selectedCategories.includes(category)
  return (
    <button
      key={category}
      className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm ${isSelected ? 'bg-surface-container-high text-primary-container' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
      aria-pressed={isSelected}
      onClick={() => updateFilter(() => setSelectedCategories(selection => cambiarSeleccion(selection, category)))}
      type="button"
    >
      {category}
    </button>
  )
})}
</div>
</div>
{/* Facet 5: Estado de Disponibilidad */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Disponibilidad</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input checked={availability.includes('immediate')} className="w-4 h-4 rounded bg-surface-container-highest text-secondary-fixed-dim focus:ring-0" type="checkbox" onChange={() => updateFilter(() => setAvailability(selection => cambiarSeleccion(selection, 'immediate')))}/>
<span className="font-body-md text-body-md text-secondary-fixed-dim font-medium">Stock Inmediato</span>
</label>
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input checked={availability.includes('preorder')} className="w-4 h-4 rounded bg-surface-container-highest text-on-tertiary-container focus:ring-0" type="checkbox" onChange={() => updateFilter(() => setAvailability(selection => cambiarSeleccion(selection, 'preorder')))}/>
<span className="font-body-md text-body-md text-on-surface">Preventas / Pre-Orders</span>
</label>
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input checked={discountOnly} className="w-4 h-4 rounded bg-surface-container-highest text-error focus:ring-0" type="checkbox" onChange={(event) => updateFilter(() => setDiscountOnly(event.target.checked))}/>
<span className="font-body-md text-body-md text-on-surface">Con Descuento Activo (&gt;20%)</span>
</label>
</div>
</div>
</div>
</aside>
{/* RIGHT GAME CARDS GRID (3 COLUMNS ON DESKTOP, 9 KEY PRODUCTS) */}
<main className="lg:col-span-3 flex flex-col gap-space-lg">
{catalog.status === 'error' && <p className="font-body-sm text-body-sm text-error" role="alert">{catalog.message} <button className="underline" onClick={retry} type="button">Reintentar</button></p>}
{/* ACTIVE APPLIED FILTERS CHIPS */}
<div className="flex flex-wrap items-center gap-2 bg-surface-container-lowest p-space-sm rounded-xl">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-2">Filtros Activos:</span>
{activeFilters.length ? activeFilters.map(filter => (
  <span key={filter.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-primary-container font-label-sm text-label-sm">
    {filter.label}
    <button className="hover:text-error transition-colors" aria-label={`Quitar filtro ${filter.label}`} onClick={filter.remove} type="button">
      <span className="material-symbols-outlined text-[13px]">close</span>
    </button>
  </span>
)) : (
  <span className="font-label-sm text-label-sm text-outline">Ninguno</span>
)}
</div>
{/* GAME CARDS MATRIX */}
<div className={`grid grid-cols-1 gap-space-md ${viewMode === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : ''}`}>
{visibleGames.map(({ game, offer }) => {
  const discount = descuentoPorcentaje(offer)
  const categories = game.categories?.map(nombreCatalogo).filter(Boolean).join(' / ')
  return (
    <article key={game.id} className={`group relative flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_24px_rgba(0,240,255,0.22)] transition-all duration-300`}>
      <div className={`relative ${viewMode === 'grid' ? 'w-full aspect-[16/10]' : 'w-36 sm:w-56 shrink-0 aspect-[16/10]'} overflow-hidden bg-surface-container`}>
        {(game.banner_url || game.cover_url) && <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={game.banner_url || game.cover_url} alt={game.title} />}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {nombreCatalogo(offer?.platform) && <span className="px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur rounded font-label-sm text-[10px] text-primary-container font-semibold uppercase">{nombreCatalogo(offer.platform)}</span>}
          {nombreCatalogo(offer?.region) && <span className="px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur rounded font-label-sm text-[10px] text-secondary-fixed-dim font-semibold uppercase">{nombreCatalogo(offer.region)}</span>}
        </div>
        {discount > 0 && <div className="absolute top-2 right-2 z-10"><span className="px-2 py-1 bg-error-container text-on-error-container rounded font-label-md text-label-md font-bold shadow-md">-{discount}%</span></div>}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-surface-container-lowest/80 backdrop-blur rounded text-secondary-fixed-dim font-label-sm text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>{offer?.edition || 'Disponible'}</div>
      </div>
      <div className="p-space-md flex-1 min-w-0 flex flex-col justify-between gap-space-sm bg-surface-container-low/60">
        <div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm pb-1"><span>{game.developer || game.publisher || ''}</span></div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">{game.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 pt-1">{game.description || categories || ''}</p>
        </div>
        <div className="pt-2 flex flex-col gap-space-sm">
          <div className="flex items-baseline justify-between">{offer?.original_price > offer?.price ? <span className="text-outline line-through font-label-sm text-label-sm">{formatoPrecio(offer.original_price, offer.currency)}</span> : <span className="text-outline font-label-sm text-label-sm">{offer?.edition || 'Precio'}</span>}<span className="font-code-key text-code-key text-primary-container font-bold">{offer ? formatoPrecio(offer.price, offer.currency) : 'Consultar precio'}</span></div>
          <div className="grid grid-cols-2 gap-2">
            <a className="py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-sm text-label-sm uppercase tracking-wider text-center transition-colors" href={`/juego/${game.slug}`}>Ver Ficha</a>
            <a className="py-2 px-3 bg-primary-container text-surface-container-lowest rounded-lg font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:bg-primary transition-all flex items-center justify-center gap-1 active:scale-[0.98]" href={`/carrito?product=${encodeURIComponent(game.slug)}&edition=${encodeURIComponent(offer?.id || '')}`}><span className="material-symbols-outlined text-[15px]">add_shopping_cart</span> Bóveda</a>
          </div>
        </div>
      </div>
    </article>
  )
})}
{catalog.status === 'loading' && <p className="font-body-sm text-body-sm text-on-surface-variant">Cargando juegos...</p>}
{catalog.status === 'ready' && games.length === 0 && <p className="font-body-sm text-body-sm text-on-surface-variant">No hay juegos para los filtros seleccionados.</p>}
</div>
{/* BOTTOM CONTROL BAR: PAGINATION & PAGE CAPACITY SELECTOR */}
<div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-lg">
{/* Page size selector */}
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm uppercase text-outline">Mostrar por nodo:</span>
<div className="inline-flex bg-surface-container-low p-1 rounded-lg">
{[12, 24, 48].map(size => (
  <button
    key={size}
    className={`px-2.5 py-1 font-label-sm text-label-sm rounded ${pageSize === size ? 'text-primary-container font-bold bg-surface-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
    aria-pressed={pageSize === size}
    onClick={() => updateFilter(() => setPageSize(size))}
    type="button"
  >
    {size}
  </button>
))}
</div>
</div>
{/* Pagination Controls */}
<div className="flex items-center gap-1">
<button className="p-2 rounded-lg bg-surface-container-low text-outline hover:text-primary-container transition-colors disabled:opacity-40" aria-label="Página anterior" disabled={currentPage <= 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} type="button">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<span className="px-3 font-label-sm text-label-sm text-on-surface-variant">Página {currentPage} de {totalPages}</span>
<button className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:text-primary-container hover:bg-surface-container transition-colors disabled:opacity-40" aria-label="Página siguiente" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} type="button">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
{/* Telemetry Status readout */}
<div className="font-label-sm text-label-sm text-outline flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px] text-secondary-fixed-dim">verified</span>
<span>MOSTRANDO {games.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, games.length)} DE {games.length}</span>
</div>
</div>
</main>
</div>
</div>
</main>
<SiteFooter />
</div>
    </>
  )
}

export default GameCatalog
