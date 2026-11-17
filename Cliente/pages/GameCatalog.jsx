import { useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo, ofertasConDescuento } from '../src/catalogUtils.js'

function GameCatalog({ user, onSignOut }) {
  const [priceLimit, setPriceLimit] = useState(1000)
  const [searchTerm, setSearchTerm] = useState('')
  const { catalog, retry } = useCatalogData()
  const games = catalog.games.filter(game => {
    const searchable = [
      game.title,
      game.developer,
      game.publisher,
      game.slug,
      ...(game.categories || []).map(nombreCatalogo),
      ...(game.offers || []).flatMap(offer => [
        nombreCatalogo(offer.platform),
        nombreCatalogo(offer.region),
        nombreCatalogo(offer.drm),
      ]),
    ].join(' ').toLowerCase()
    const matchesSearch = searchable.includes(searchTerm.toLowerCase())
    const offer = ofertasConDescuento([game])[0]?.offer || game.offers?.[0]
    return matchesSearch && (!offer || Number(offer.price) <= priceLimit)
  })
  const username = user?.user_metadata?.username || user?.email

  function resetFilters() {
    setPriceLimit(1000)
    setSearchTerm('')
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
{/* TOP APP BAR */}
<header className="bg-surface-container-lowest shadow-[0_0_20px_rgba(0,240,255,0.12)] border-b border-outline-variant sticky top-0 z-50 backdrop-blur-lg bg-surface-container-lowest/90">
<div className="h-16 w-full px-space-md lg:px-space-xl flex items-center justify-between mx-auto gap-space-md">
{/* Brand & Main Nav Links */}
<div className="flex items-center gap-space-lg flex-1">
<a className="font-headline-md text-headline-md tracking-wider uppercase text-primary-container flex items-center gap-2 shrink-0 active:scale-[0.98] transition-transform" href="/catalogo">
<span className="w-2.5 h-6 bg-primary-container inline-block shadow-[0_0_12px_#00f0ff]"></span>
        Nexus Keys
      </a>
{/* Core Navigation Links (Text-only with data-path bindings) */}
<nav className="hidden lg:flex items-center gap-space-md" data-active-classes="text-primary-container border-b-2 border-primary-container font-semibold">
<a aria-current="page" className="uppercase tracking-wider transition-colors py-1 text-primary-container border-b-2 border-primary-container font-semibold" data-path="catalogo" href="/catalogo-completo">Catálogo</a>
<a className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="plataformas" href="/catalogo-completo">Plataformas</a>
<a className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="ofertas" href="/catalogo-completo">Ofertas</a>
<a className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="mi-boveda" href="/claves">Mi Bóveda</a>
</nav>
{/* License Key Search Bar */}
<div className="relative w-full max-w-xs xl:max-w-sm hidden md:block ml-auto lg:ml-space-md">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="vpn_key">vpn_key</span>
</div>
<input className="w-full pl-9 pr-14 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-outline font-label-sm text-label-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" placeholder="BUSCAR LICENCIA O NODO..." type="text"/>
<div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
<kbd className="font-label-sm text-[10px] text-outline px-1.5 py-0.5 border border-outline-variant rounded bg-surface-container">⌘K</kbd>
</div>
</div>
</div>
{/* Trailing Cluster: Cart + Auth Actions */}
<div className="flex items-center gap-space-sm shrink-0">
{/* Shopping Cart Trigger with Cyber Count Badge */}
<a aria-label="Carrito de compras" className="relative p-2 text-on-surface-variant hover:text-primary-container transition-colors active:scale-[0.98] rounded-lg border border-outline-variant/60 bg-surface-container-low" data-path="carrito" href="/carrito">
<span className="material-symbols-outlined text-xl" data-icon="shopping_cart">shopping_cart</span>
<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-secondary-container text-surface-container-lowest font-label-sm text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_#34ff8d]">
          3
        </span>
</a>
<div className="h-5 w-px bg-outline-variant hidden sm:block"></div>
{/* Auth: Iniciar Sesión (Ultraviolet Border Cue) */}
<a className="font-label-md text-label-md px-3.5 py-1.5 text-primary-container hover:bg-surface-container rounded-lg border border-primary-container/40 hover:border-tertiary-container transition-all active:scale-[0.98]" data-path="mi-boveda" href="/claves">
        Mi Bóveda
      </a>
<span className="hidden xl:inline font-label-sm text-label-sm text-on-surface-variant" title={username}>{username}</span>
<button className="font-label-md text-label-md px-4 py-1.5 bg-primary-container text-surface-container-lowest font-bold rounded-lg shadow-[0_0_14px_rgba(0,240,255,0.4)] hover:bg-primary transition-all active:scale-[0.98]" onClick={onSignOut} type="button">
        Cerrar sesión
      </button>
</div>
</div>
</header>
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
            DISPONIBLES: <strong className="text-primary-container">85 PRODUCTOS</strong>
</div>
</div>
</div>
{/* Live Search & Fast Query Bar */}
<div className="flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
<div className="relative flex-1">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-container">
<span className="material-symbols-outlined text-lg">search</span>
</div>
<input className="w-full pl-10 pr-24 py-3 bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline font-label-md text-label-md focus:outline-none focus:bg-surface-container transition-all" id="catalogSearch" placeholder="Buscar por título, desarrollador, franquicia o DRM (Steam, PS5, Xbox)..." type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
<span className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[10px] text-outline">ESC</span>
</div>
</div>
{/* Sort Matrix Dropdown & View Mode */}
<div className="flex items-center gap-space-sm shrink-0">
<div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl">
<span className="font-label-sm text-label-sm text-outline uppercase">Ordenar:</span>
<select className="bg-transparent font-label-md text-label-md text-primary-container font-semibold focus:outline-none cursor-pointer">
<option className="bg-surface-container-lowest text-on-surface" value="popular">Más Populares</option>
<option className="bg-surface-container-lowest text-on-surface" value="price_low">Menor Precio</option>
<option className="bg-surface-container-lowest text-on-surface" value="discount">Mayor Descuento %</option>
<option className="bg-surface-container-lowest text-on-surface" value="recent">Lanzamientos Recientes</option>
<option className="bg-surface-container-lowest text-on-surface" value="rating">Mejor Calificados</option>
</select>
</div>
<div className="hidden sm:flex items-center bg-surface-container-low p-1 rounded-xl">
<button className="p-2 bg-surface-container rounded text-primary-container shadow-sm" title="Vista de Rejilla">
<span className="material-symbols-outlined text-[18px]">grid_view</span>
</button>
<button className="p-2 text-outline hover:text-on-surface transition-colors" title="Vista de Lista">
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
{/* Facet 1: Plataforma / DRM */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Plataforma &amp; DRM</span>
<span className="text-outline font-label-sm">[6]</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input defaultChecked className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">Steam PC</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">62</span>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input defaultChecked className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">PlayStation 5</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">38</span>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">Xbox Series X|S</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">31</span>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">Nintendo Switch</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">24</span>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">GOG / Sin DRM</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">18</span>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
<div className="flex items-center gap-2">
<input className="w-4 h-4 rounded bg-surface-container-highest text-primary-container focus:ring-0 cursor-pointer" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover:text-primary-container transition-colors">Epic Games</span>
</div>
<span className="font-label-sm text-label-sm text-outline px-1.5 py-0.5 rounded bg-surface-container">12</span>
</label>
</div>
</div>
{/* Facet 2: Rango de Precio y Acceso Rápido */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Rango de Precio</span>
<span className="text-primary-container font-code-key text-code-key" id="priceDisplay">{`$0 - ${priceLimit} MXN`}</span>
</div>
<div className="pt-2 px-1">
<input className="w-full accent-primary-container bg-surface-container-high h-1.5 rounded-lg cursor-pointer" id="priceSlider" max="1000" min="0" type="range" value={priceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))}/>
<div className="flex justify-between font-label-sm text-[10px] text-outline pt-1">
<span>$0</span>
<span>$500</span>
<span>$1000+</span>
</div>
</div>
{/* Quick Price Selectors */}
<div className="grid grid-cols-2 gap-1.5 pt-2">
<button className="py-1 px-2 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors text-center">
              &lt; $10 USD
            </button>
<button className="py-1 px-2 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors text-center">
              $10 - $25 USD
            </button>
<button className="py-1 px-2 rounded bg-surface-container-high text-primary-container font-label-sm text-label-sm font-semibold transition-colors text-center">
              $25 - $50 USD
            </button>
<button className="py-1 px-2 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors text-center">
              &gt; $50 USD
            </button>
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
<span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">public</span> Global (Sin Bloqueo)
              </span>
<input defaultChecked className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio"/>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">language</span> LATAM
              </span>
<input className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio"/>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">language</span> Norteamérica (US/CA)
              </span>
<input className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio"/>
</label>
<label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">language</span> Europa (EU)
              </span>
<input className="w-4 h-4 text-primary-container bg-surface-container-highest focus:ring-0" name="region_filter" type="radio"/>
</label>
</div>
</div>
{/* Facet 4: Género / Categoría */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Género &amp; Tag</span>
</div>
<div className="flex flex-wrap gap-1.5 pt-1">
<button className="px-2.5 py-1 bg-surface-container-high text-primary-container rounded-lg font-label-sm text-label-sm">RPG de Acción</button>
<button className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">Cyberpunk</button>
<button className="px-2.5 py-1 bg-surface-container-high text-primary-container rounded-lg font-label-sm text-label-sm">Shooters / FPS</button>
<button className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">Sci-Fi</button>
<button className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">Supervivencia</button>
<button className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">Carreras</button>
<button className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">Indie Vault</button>
</div>
</div>
{/* Facet 5: Estado de Disponibilidad */}
<div className="space-y-space-xs pt-2">
<div className="flex items-center justify-between text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider">
<span>Disponibilidad</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input defaultChecked className="w-4 h-4 rounded bg-surface-container-highest text-secondary-fixed-dim focus:ring-0" type="checkbox"/>
<span className="font-body-md text-body-md text-secondary-fixed-dim font-medium">Stock Inmediato</span>
</label>
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input className="w-4 h-4 rounded bg-surface-container-highest text-on-tertiary-container focus:ring-0" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface">Preventas / Pre-Orders</span>
</label>
<label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
<input defaultChecked className="w-4 h-4 rounded bg-surface-container-highest text-error focus:ring-0" type="checkbox"/>
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
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-primary-container font-label-sm text-label-sm">
          Steam PC
          <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[13px]">close</span></button>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-primary-container font-label-sm text-label-sm">
          PlayStation 5
          <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[13px]">close</span></button>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-secondary-fixed-dim font-label-sm text-label-sm">
          Global Key
          <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[13px]">close</span></button>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-error font-label-sm text-label-sm">
          Con Descuento &gt; 20%
          <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[13px]">close</span></button>
</span>
</div>
{/* GAME CARDS MATRIX */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md">
{games.map(game => {
  const offer = ofertasConDescuento([game])[0]?.offer || game.offers?.[0]
  const discount = offer?.original_price > offer?.price
    ? Math.round((offer.original_price - offer.price) / offer.original_price * 100)
    : 0
  const categories = game.categories?.map(nombreCatalogo).filter(Boolean).join(' / ')
  return (
    <article key={game.id} className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_24px_rgba(0,240,255,0.22)] transition-all duration-300">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
        {(game.banner_url || game.cover_url) && <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={game.banner_url || game.cover_url} alt={game.title} />}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {nombreCatalogo(offer?.platform) && <span className="px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur rounded font-label-sm text-[10px] text-primary-container font-semibold uppercase">{nombreCatalogo(offer.platform)}</span>}
          {nombreCatalogo(offer?.region) && <span className="px-2 py-0.5 bg-surface-container-lowest/90 backdrop-blur rounded font-label-sm text-[10px] text-secondary-fixed-dim font-semibold uppercase">{nombreCatalogo(offer.region)}</span>}
        </div>
        {discount > 0 && <div className="absolute top-2 right-2 z-10"><span className="px-2 py-1 bg-error-container text-on-error-container rounded font-label-md text-label-md font-bold shadow-md">-{discount}%</span></div>}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-surface-container-lowest/80 backdrop-blur rounded text-secondary-fixed-dim font-label-sm text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>{offer?.edition || 'Disponible'}</div>
      </div>
      <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm bg-surface-container-low/60">
        <div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm pb-1"><span>{game.developer || game.publisher || ''}</span></div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">{game.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 pt-1">{game.description || categories || ''}</p>
        </div>
        <div className="pt-2 flex flex-col gap-space-sm">
          <div className="flex items-baseline justify-between">{offer?.original_price > offer?.price ? <span className="text-outline line-through font-label-sm text-label-sm">{formatoPrecio(offer.original_price, offer.currency)}</span> : <span className="text-outline font-label-sm text-label-sm">{offer?.edition || 'Precio'}</span>}<span className="font-code-key text-code-key text-primary-container font-bold">{offer ? formatoPrecio(offer.price, offer.currency) : 'Consultar precio'}</span></div>
          <div className="grid grid-cols-2 gap-2">
            <a className="py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-sm text-label-sm uppercase tracking-wider text-center transition-colors" href={`/juego/${game.slug}`}>Ver Ficha</a>
            <a className="py-2 px-3 bg-primary-container text-surface-container-lowest rounded-lg font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:bg-primary transition-all flex items-center justify-center gap-1 active:scale-[0.98]" href={`/carrito?product=${encodeURIComponent(game.slug)}`}><span className="material-symbols-outlined text-[15px]">add_shopping_cart</span> Bóveda</a>
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
<button className="px-2.5 py-1 text-primary-container font-label-sm text-label-sm font-bold bg-surface-container rounded shadow-sm">12</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors">24</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors">48</button>
</div>
</div>
{/* Pagination Controls */}
<div className="flex items-center gap-1">
<button className="p-2 rounded-lg bg-surface-container-low text-outline hover:text-primary-container transition-colors disabled:opacity-40" disabled>
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-container text-surface-container-lowest font-label-md text-label-md font-bold shadow-[0_0_10px_rgba(0,240,255,0.35)]">
            1
          </button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors">
            2
          </button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors">
            3
          </button>
<span className="w-9 h-9 flex items-center justify-center text-outline font-label-sm">...</span>
<button className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors">
            8
          </button>
<button className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:text-primary-container hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
{/* Telemetry Status readout */}
<div className="font-label-sm text-label-sm text-outline flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px] text-secondary-fixed-dim">verified</span>
<span>SINCRONIZACIÓN ACTIVA ({catalog.games.length} JUEGOS)</span>
</div>
</div>
</main>
</div>
</div>
</main>
{/* FOOTER */}
<footer className="bg-surface-container-lowest border-t border-outline-variant mt-space-xl">
<div className="w-full px-space-md lg:px-space-xl py-space-xl flex flex-col gap-space-lg mx-auto max-w-7xl">
{/* Footer Top Matrix: Brand + Links Columns */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-space-lg">
{/* Brand column */}
<div className="col-span-2 space-y-space-sm">
<div className="font-headline-sm text-headline-sm text-primary-container uppercase tracking-widest flex items-center gap-2">
<span className="w-2 h-4 bg-primary-container inline-block shadow-[0_0_8px_#00f0ff]"></span>
          Nexus Keys
        </div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          La bóveda neural de activación de licencias de videojuegos con protocolo de entrega cuántica instantánea y validación criptográfica en tiempo real.
        </p>
<div className="flex items-center gap-2 pt-2">
<span className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[10px] text-primary-container border border-primary-container/30">STATUS: ONLINE</span>
<span className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[10px] text-outline border border-outline-variant">DISCORD LINK</span>
<span className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[10px] text-outline border border-outline-variant">X UPLINK</span>
</div>
</div>
{/* Links Column: Plataformas */}
<div className="space-y-2">
<h4 className="font-label-md text-label-md text-white uppercase font-bold tracking-wider">Plataformas</h4>
<ul className="space-y-1.5 font-label-sm text-label-sm">
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Steam PC</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">PlayStation 5</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Xbox Series X|S</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Nintendo Switch</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Epic Games &amp; GOG</a></li>
</ul>
</div>
{/* Links Column: Soporte */}
<div className="space-y-2">
<h4 className="font-label-md text-label-md text-white uppercase font-bold tracking-wider">Soporte &amp; Ayuda</h4>
<ul className="space-y-1.5 font-label-sm text-label-sm">
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Instant Delivery FAQ</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Refund Node</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Support Uplink</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Guía de Activación</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Estado del Servidor</a></li>
</ul>
</div>
{/* Links Column: Protocolo Legal */}
<div className="space-y-2">
<h4 className="font-label-md text-label-md text-white uppercase font-bold tracking-wider">Protocolo Legal</h4>
<ul className="space-y-1.5 font-label-sm text-label-sm">
<li><a className="text-primary-container font-label-sm text-label-sm hover:text-secondary-fixed-dim transition-colors" href="#">Terms of Protocol</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Privacy Matrix</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Merchant Portal</a></li>
<li><a className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors" href="#">Política Anti-Fraude</a></li>
</ul>
</div>
{/* Links Column: Pasarelas de Pago */}
<div className="space-y-2">
<h4 className="font-label-md text-label-md text-white uppercase font-bold tracking-wider">Cifrado Seguro</h4>
<div className="grid grid-cols-2 gap-2 text-outline font-label-sm text-[11px]">
<div className="p-1.5 border border-outline-variant rounded bg-surface-container text-center font-bold">VISA</div>
<div className="p-1.5 border border-outline-variant rounded bg-surface-container text-center font-bold">MC</div>
<div className="p-1.5 border border-outline-variant rounded bg-surface-container text-center font-bold">PAYPAL</div>
<div className="p-1.5 border border-outline-variant rounded bg-surface-container text-center font-bold">CRYPTO</div>
</div>
<div className="text-[10px] text-outline pt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-xs text-secondary-container" data-icon="lock">lock</span> Cifrado SSL 256-bit
        </div>
</div>
</div>
{/* Footer Bottom Division */}
<div className="pt-space-md border-t border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-space-md">
<p className="font-body-sm text-body-sm text-outline text-center md:text-left">
        © 2025 Nexus Keys Vault. Instant Neural Link Delivery. All trademarks belong to respective publishers.
      </p>
<div className="flex items-center gap-4 text-outline font-label-sm text-xs">
<span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_#34ff8d]"></span> NODES ACTIVE</span>
<span>LATENCIA: 18MS</span>
</div>
</div>
</div>
</footer>
</div>
    </>
  )
}

export default GameCatalog
