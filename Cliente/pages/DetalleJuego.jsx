import { useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo } from '../src/catalogUtils.js'

function DetalleJuego() {
  const { catalog, retry } = useCatalogData()
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('lore')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedEdition, setSelectedEdition] = useState('')
  const slug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean).pop() || '')
  const game = catalog.games.find(item => item.slug === slug)
    || (!window.location.pathname.startsWith('/juego/') ? catalog.games[0] : undefined)
  const galleryImages = [game?.banner_url, game?.cover_url].filter(Boolean)
  const offers = game?.offers || []
  const platforms = [...new Set(offers.map(offer => nombreCatalogo(offer.platform)).filter(Boolean))]
  const regions = [...new Set(offers.map(offer => nombreCatalogo(offer.region)).filter(Boolean))]
  const currentEdition = offers.find(offer => String(offer.id) === String(selectedEdition))
    || offers.find(offer => (!selectedPlatform || nombreCatalogo(offer.platform) === selectedPlatform)
      && (!selectedRegion || nombreCatalogo(offer.region) === selectedRegion))
    || offers[0]
  const tabButtonClass = (tab) => `tab-btn pb-2.5 px-4 font-headline-sm text-headline-sm ${activeTab === tab ? 'text-primary-container border-b-2 border-primary-container font-semibold' : 'text-on-surface-variant hover:text-on-surface'} transition-all flex items-center gap-2 whitespace-nowrap`
  const platformButtonClass = (platform) => `platform-btn p-2.5 rounded-lg font-label-sm text-label-sm flex flex-col items-center gap-1 active:scale-95 transition-all ${(selectedPlatform || nombreCatalogo(currentEdition?.platform)) === platform ? 'bg-surface-container-highest text-primary-container font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]' : 'bg-surface-container text-on-surface-variant hover:text-on-surface font-medium'}`
  const regionButtonClass = (region) => `region-btn p-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-all ${(selectedRegion || nombreCatalogo(currentEdition?.region)) === region ? 'bg-surface-container-highest text-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface font-medium'}`
  const discountPercent = currentEdition?.original_price > currentEdition?.price
    ? Math.round((currentEdition.original_price - currentEdition.price) / currentEdition.original_price * 100)
    : 0
  const goToCart = () => {
    const query = new URLSearchParams({
      product: game.slug,
      platform: nombreCatalogo(currentEdition?.platform) || selectedPlatform,
      region: nombreCatalogo(currentEdition?.region) || selectedRegion,
      edition: currentEdition?.edition || selectedEdition,
    })
    window.location.assign(`/carrito?${query}`)
  }

  if (catalog.status === 'loading') {
    return <main className="bg-background text-on-surface min-h-screen p-space-xl">Cargando juego...</main>
  }

  if (catalog.status === 'error') {
    return <main className="bg-background text-on-surface min-h-screen p-space-xl" role="alert">{catalog.message} <button className="underline" onClick={retry} type="button">Reintentar</button></main>
  }

  if (!game) {
    return <main className="bg-background text-on-surface min-h-screen p-space-xl">Juego no encontrado. <a className="underline" href="/catalogo-completo">Volver al catálogo</a></main>
  }

  return (
<div className={"bg-background text-on-surface antialiased selection:bg-primary-container selection:text-surface-container-lowest min-h-screen flex flex-col cyber-grid"}>
  <main className={"flex-grow max-w-7xl mx-auto w-full px-space-md lg:px-space-xl py-space-lg space-y-space-xl pt-16"}>
    <div className={"flex flex-col w-full"}>
      <div className={"flex flex-wrap items-center justify-between gap-space-sm mb-space-md"}>
        <div className={"flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"}>
          <a className={"hover:text-primary-container transition-colors uppercase"} href={"/catalogo"}>
            Nexus
          </a>
          <span className={"text-outline"}>
            /
          </span>
          <a className={"hover:text-primary-container transition-colors uppercase"} href={"/catalogo-completo"}>
            Catálogo
          </a>
          <span className={"text-outline"}>
            /
          </span>
          <a className={"hover:text-primary-container transition-colors uppercase"} href={"/catalogo-completo"}>
            {game.categories?.map(category => category.name || category).join(' / ') || game.title}
          </a>
          <span className={"text-outline"}>
            /
          </span>
          <span className={"text-primary-container font-semibold truncate max-w-[200px] md:max-w-none"}>
            {game.title.toUpperCase()}
          </span>
        </div>
        <div className={"flex items-center gap-space-sm"}>
          <div className={"flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-secondary-container shadow-[0_0_12px_rgba(52,255,141,0.2)]"}>
            <span className={"w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"}>
            </span>
            <span className={"font-label-sm text-label-sm font-semibold tracking-wider"}>
              NODO EN LÍNEA: 18MS
            </span>
          </div>
          <div className={"hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-on-surface-variant font-label-sm text-label-sm"}>
            <span className={"material-symbols-outlined text-[14px] text-tertiary-container"}>
              verified_user
            </span>
            <span>
              SHA-256 VAULT SECURED
            </span>
          </div>
        </div>
      </div>
      <div className={"grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start"}>
        <div className={"lg:col-span-7 space-y-space-md"}>
          <div className={"relative bg-surface-container-low rounded-xl overflow-hidden shadow-2xl group"}>
            <div className={"absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent z-20"}>
            </div>
            <div className={"relative w-full aspect-[16/9] overflow-hidden bg-surface-container-lowest"}>
              <div className={"w-full h-full bg-cover bg-center transition-all duration-500 scale-100 group-hover:scale-105"} id={"main-preview-img"} style={{ backgroundImage: `url('${galleryImages[activeImage]}')` }}>
              </div>
              <div className={"absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none"}>
              </div>
              <div className={"absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"}>
                <button className={"w-14 h-14 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-primary-container shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-110 active:scale-95 transition-all"} type={"button"}>
                  <span className={"material-symbols-outlined text-3xl ml-0.5"}>
                    play_arrow
                  </span>
                </button>
              </div>
              <div className={"absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none"}>
                <div className={"space-y-1"}>
                  <div className={"flex items-center gap-2"}>
                    <span className={"px-2 py-0.5 rounded bg-surface-container-highest/90 text-primary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider backdrop-blur-sm"}>
                      {game.categories?.map(nombreCatalogo).filter(Boolean).join(' / ') || 'Juego'}</span>
                    <span className={"px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-semibold uppercase tracking-wider backdrop-blur-sm"}>
                      {game.developer || game.publisher || ''}
                    </span>
                  </div>
                  <h1 className={"font-headline-lg text-headline-lg text-on-surface drop-shadow-md"}>
                    {game.title}
                  </h1>
                </div>
                <div className={"hidden sm:flex flex-col items-end"}>
                  <span className={"font-label-sm text-label-sm text-on-surface-variant"}>
                    FECHA DE LANZAMIENTO
                  </span>
                  <span className={"font-headline-sm text-headline-sm text-secondary-container font-bold"}>
                    {game.release_date || 'N/D'}
                  </span>
                </div>
              </div>
            </div>
            <div className={"p-space-sm bg-surface-container-low flex items-center gap-space-sm overflow-x-auto"}>
              {galleryImages.map((image, index) => (
                <button key={`${image}-${index}`} aria-pressed={activeImage === index} className={`relative flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-surface-container-highest ${activeImage === index ? 'ring-2 ring-primary-container' : 'opacity-70 hover:opacity-100'} focus:outline-none transition-all`} onClick={() => setActiveImage(index)} type={"button"}>
                  <div className={"w-full h-full bg-cover bg-center"} style={{ backgroundImage: `url('${image}')` }}>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className={"grid grid-cols-2 md:grid-cols-4 gap-space-sm"}>
            <div className={"bg-surface-container p-space-sm rounded-lg flex items-center gap-3"}>
              <div className={"w-9 h-9 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  bolt
                </span>
              </div>
              <div>
                <div className={"font-label-md text-label-md text-on-surface font-semibold"}>
                  Instantáneo
                </div>
                <div className={"font-body-sm text-body-sm text-outline"}>
                  Envío &lt; 10 seg
                </div>
              </div>
            </div>
            <div className={"bg-surface-container p-space-sm rounded-lg flex items-center gap-3"}>
              <div className={"w-9 h-9 rounded-lg bg-secondary-container/10 text-secondary-container flex items-center justify-center shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  verified
                </span>
              </div>
              <div>
                <div className={"font-label-md text-label-md text-on-surface font-semibold"}>
                  Oficial
                </div>
                <div className={"font-body-sm text-body-sm text-outline"}>
                  Key Mayorista
                </div>
              </div>
            </div>
            <div className={"bg-surface-container p-space-sm rounded-lg flex items-center gap-3"}>
              <div className={"w-9 h-9 rounded-lg bg-on-tertiary-container/20 text-tertiary-container flex items-center justify-center shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  shield
                </span>
              </div>
              <div>
                <div className={"font-label-md text-label-md text-on-surface font-semibold"}>
                  Shield 365
                </div>
                <div className={"font-body-sm text-body-sm text-outline"}>
                  Garantía total
                </div>
              </div>
            </div>
            <div className={"bg-surface-container p-space-sm rounded-lg flex items-center gap-3"}>
              <div className={"w-9 h-9 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  headset_mic
                </span>
              </div>
              <div>
                <div className={"font-label-md text-label-md text-on-surface font-semibold"}>
                  24/7 Uplink
                </div>
                <div className={"font-body-sm text-body-sm text-outline"}>
                  Soporte neural
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"lg:col-span-5 space-y-space-md"}>
          <div className={"bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-xl relative overflow-hidden space-y-space-md"}>
            <div className={"absolute top-0 right-0 w-36 h-36 bg-primary-container/5 rounded-full blur-2xl pointer-events-none"}>
            </div>
            <div className={"bg-surface-container p-space-sm rounded-lg flex items-start gap-3"}>
              <span className={"material-symbols-outlined text-secondary-container mt-0.5"}>
                location_on
              </span>
              <div className={"flex-1"}>
                <div className={"flex items-center justify-between"}>
                  <span className={"font-label-md text-label-md text-on-surface font-semibold"}>
                    Detección de Nodo Geográfico
                  </span>
                  <span className={"font-label-sm text-[10px] text-secondary-container bg-surface-container-lowest px-2 py-0.5 rounded font-bold uppercase tracking-wider"}>
                    Activación Válida
                  </span>
                </div>
                <p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>
                  {' '}Tu IP actual está sincronizada en{' '}
                  <strong className={"text-on-surface"}>
                    {selectedRegion === 'Global' ? 'LATAM / Región Global' : selectedRegion}
                  </strong>
                  . Esta clave se activará sin restricciones VPN.{' '}
                </p>
              </div>
            </div>
            <div className={"space-y-2"}>
              <div className={"flex items-center justify-between"}>
                <label className={"font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold"}>
                  1. Plataforma de Activación
                </label>
                <span className={"font-label-sm text-label-sm text-outline"}>
                  CLIENTE REQUERIDO
                </span>
              </div>
              <div className={"grid grid-cols-2 sm:grid-cols-4 gap-2"} id={"platform-selector"}>
                {platforms.map(platform => (
                  <button key={platform} aria-pressed={(selectedPlatform || nombreCatalogo(currentEdition?.platform)) === platform} className={platformButtonClass(platform)} data-platform={platform} onClick={() => { setSelectedPlatform(platform); setSelectedRegion(''); setSelectedEdition('') }} type={"button"}>
                    <span className={"material-symbols-outlined text-xl"}>sports_esports</span>
                    <span>{platform}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={"space-y-2"}>
              <div className={"flex items-center justify-between"}>
                <label className={"font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold"}>
                  2. Jurisdicción / Región
                </label>
                <span className={"font-label-sm text-label-sm text-secondary-container"}>
                  {'VERIFICADO '}{(selectedRegion || nombreCatalogo(currentEdition?.region)).toUpperCase()}
                </span>
              </div>
              <div className={"grid grid-cols-3 gap-2"} id={"region-selector"}>
                {regions.map(region => (
                  <button key={region} aria-pressed={(selectedRegion || nombreCatalogo(currentEdition?.region)) === region} className={regionButtonClass(region)} onClick={() => { setSelectedRegion(region); setSelectedPlatform(''); setSelectedEdition('') }} type={"button"}>
                    <span className={"material-symbols-outlined text-sm"}>public</span>
                    <span>{region}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={"space-y-2"}>
              <label className={"font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold"}>
                3. Nivel de Protocolo (Edición)
              </label>
              <div className={"space-y-2"} id={"edition-selector"}>
                {offers.map(offer => (
                  <label key={offer.id} className={`edition-option p-3 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${String(currentEdition?.id) === String(offer.id) ? 'bg-surface-container-highest ring-1 ring-primary-container' : 'bg-surface-container hover:bg-surface-container-high'}`} htmlFor={`offer-${offer.id}`}>
                    <div className={"flex items-center gap-3"}>
                      <input checked={String(currentEdition?.id) === String(offer.id)} className={"w-4 h-4 text-primary-container bg-surface-container-lowest focus:ring-0 focus:outline-none"} id={`offer-${offer.id}`} name={"edition"} onChange={() => { setSelectedEdition(String(offer.id)); setSelectedPlatform(nombreCatalogo(offer.platform)); setSelectedRegion(nombreCatalogo(offer.region)) }} type={"radio"} />
                      <div>
                        <div className={"font-headline-sm text-headline-sm text-on-surface"}>{offer.edition || 'Edición disponible'}</div>
                        <div className={"font-body-sm text-body-sm text-outline"}>{[nombreCatalogo(offer.platform), nombreCatalogo(offer.region), nombreCatalogo(offer.drm)].filter(Boolean).join(' / ')}</div>
                      </div>
                    </div>
                    <div className={"text-right"}>
                      <div className={"font-headline-sm text-headline-sm text-primary-container font-extrabold"}>{formatoPrecio(offer.price, offer.currency)}</div>
                      {offer.original_price > offer.price && <div className={"font-label-sm text-[10px] text-outline line-through"}>{formatoPrecio(offer.original_price, offer.currency)}</div>}
                    </div>
                  </label>
                ))}
                {offers.length === 0 && <p className={"font-body-sm text-body-sm text-outline"}>No hay ofertas disponibles para este juego.</p>}
              </div>
            </div>
            <div className={"pt-2 space-y-space-sm bg-surface-container-lowest/60 p-space-md rounded-xl"}>
              <div className={"flex items-baseline justify-between"}>
                <div className={"space-y-0.5"}>
                  {currentEdition?.original_price > currentEdition?.price && <div className={"flex items-center gap-2"}>
                    <span className={"font-label-sm text-label-sm text-outline line-through"} id={"original-price"}>
                      {formatoPrecio(currentEdition.original_price, currentEdition.currency)}
                    </span>
                    <span className={"px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px] font-bold"}>
                      -{discountPercent}% FLASH
                    </span>
                  </div>}
                  <div className={"font-headline-xl text-headline-xl text-primary font-black tracking-tight"} id={"display-price"}>
                    {currentEdition ? formatoPrecio(currentEdition.price, currentEdition.currency) : 'Consultar precio'}
                  </div>
                  <div className={"font-label-sm text-label-sm text-on-surface-variant"}>
                    {currentEdition ? [nombreCatalogo(currentEdition.platform), nombreCatalogo(currentEdition.region), currentEdition.edition].filter(Boolean).join(' / ') : 'Sin ofertas'}
                  </div>
                </div>
                <div className={"text-right space-y-1"}>
                  <div className={"flex items-center gap-1.5 text-secondary-container justify-end"}>
                    <span className={"w-2 h-2 rounded-full bg-secondary-container animate-ping"}>
                    </span>
                    <span className={"font-label-md text-label-md font-bold"}>
                      {currentEdition ? 'OFERTA DISPONIBLE' : 'SIN OFERTAS'}
                    </span>
                  </div>
                  <div className={"font-label-sm text-[10px] text-outline"}>
                    INFORMACIÓN DEL CATÁLOGO
                  </div>
                </div>
              </div>
              <div className={"space-y-2 pt-1"}>
                <button disabled={!currentEdition} className={"w-full py-3.5 px-space-md bg-primary-container text-surface-container-lowest font-headline-sm text-headline-sm font-extrabold uppercase tracking-wider rounded-lg shadow-[0_0_24px_rgba(0,240,255,0.4)] hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2"} id={"buy-instant-btn"} onClick={(event) => {
                  event.stopPropagation()
                  goToCart()
                }} type={"button"}>
                  <span className={"material-symbols-outlined text-2xl font-black"}>
                    flash_on
                  </span>
                  <span>
                    Comprar Licencia Inmediata
                  </span>
                </button>
                <div className={"grid grid-cols-2 gap-2"}>
                  <button disabled={!currentEdition} className={"py-2.5 px-space-sm bg-surface-container text-primary-container hover:bg-surface-container-highest rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"} onClick={(event) => {
                    event.stopPropagation()
                    goToCart()
                  }} type={"button"}>
                    <span className={"material-symbols-outlined text-lg"}>
                      add_shopping_cart
                    </span>
                    <span>
                      Añadir al Carrito
                    </span>
                  </button>
                  <button className={"py-2.5 px-space-sm bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded-lg font-label-md text-label-md font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"} type={"button"}>
                    <span className={"material-symbols-outlined text-lg"}>
                      favorite
                    </span>
                    <span>
                      Lista de Deseos
                    </span>
                  </button>
                </div>
              </div>
              <div className={"pt-2 flex items-center gap-2 text-on-surface-variant font-label-sm text-[11px]"}>
                <span className={"material-symbols-outlined text-base text-primary-container shrink-0"}>
                  info
                </span>
                <span>
                  La oferta seleccionada se activa en la plataforma correspondiente: {' '}
                  <strong className={"text-on-surface"}>{nombreCatalogo(currentEdition?.platform) || 'no especificada'}</strong>.
                </span>
              </div>
            </div>
          </div>
          <div className={"bg-surface-container p-space-sm rounded-xl flex items-center justify-between"}>
            <div className={"flex items-center gap-2.5"}>
              <div className={"w-8 h-8 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center"}>
                <span className={"material-symbols-outlined text-lg"}>
                  sync
                </span>
              </div>
              <div>
                <div className={"font-label-sm text-label-sm text-on-surface font-semibold"}>
                  Proceso de Inyección Instantánea
                </div>
                <div className={"font-body-sm text-body-sm text-outline"}>
                  Código visible en pantalla + Respaldo en Mi Bóveda
                </div>
              </div>
            </div>
            <span className={"font-label-sm text-[10px] text-primary-container font-mono bg-surface-container-lowest px-2 py-1 rounded"}>
              256-BIT AES
            </span>
          </div>
        </div>
      </div>
      <div className={"mt-space-xl bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-xl space-y-space-md"}>
        <div className={"flex items-center gap-space-sm overflow-x-auto pb-2 border-b border-surface-container-highest"}>
          <button aria-selected={activeTab === 'lore'} className={tabButtonClass('lore')} id={"tab-btn-lore"} onClick={() => setActiveTab('lore')} role={"tab"} type={"button"}>
            <span className={"material-symbols-outlined text-lg"}>
              terminal
            </span>
            <span>
              Descripción &amp; Lore
            </span>
          </button>
          <button aria-selected={activeTab === 'specs'} className={tabButtonClass('specs')} id={"tab-btn-specs"} onClick={() => setActiveTab('specs')} role={"tab"} type={"button"}>
            <span className={"material-symbols-outlined text-lg"}>
              memory
            </span>
            <span>
              Requisitos de Sistema (PC)
            </span>
          </button>
          <button aria-selected={activeTab === 'compatibility'} className={tabButtonClass('compatibility')} id={"tab-btn-compatibility"} onClick={() => setActiveTab('compatibility')} role={"tab"} type={"button"}>
            <span className={"material-symbols-outlined text-lg"}>
              tune
            </span>
            <span>
              Compatibilidad &amp; Hardware
            </span>
          </button>
          <button aria-selected={activeTab === 'redemption'} className={tabButtonClass('redemption')} id={"tab-btn-redemption"} onClick={() => setActiveTab('redemption')} role={"tab"} type={"button"}>
            <span className={"material-symbols-outlined text-lg"}>
              vpn_key
            </span>
            <span>
              Protocolo de Canje
            </span>
          </button>
        </div>
        <div className={`tab-panel ${activeTab === 'lore' ? '' : 'hidden'} space-y-space-md`} id={"tab-content-lore"} role={"tabpanel"}>
          <div className={"grid grid-cols-1 lg:grid-cols-3 gap-space-lg"}>
            <div className={"lg:col-span-2 space-y-space-sm"}>
              <h2 className={"font-headline-md text-headline-md text-on-surface"}>{game.title}</h2>
              <p className={"font-body-md text-body-md text-on-surface-variant leading-relaxed"}>{game.description || 'No hay una descripcion disponible para este juego.'}</p>
            </div>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-space-sm"}>
              <h3 className={"font-label-md text-label-md uppercase tracking-wider text-outline"}>
                Ficha Técnica Cuántica
              </h3>
              <div className={"space-y-2.5 font-label-sm text-label-sm"}>
                <div className={"flex justify-between py-1 border-b border-surface-container-highest"}>
                  <span className={"text-on-surface-variant"}>
                    Desarrollador
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    {game.developer || 'No disponible'}
                  </span>
                </div>
                <div className={"flex justify-between py-1 border-b border-surface-container-highest"}>
                  <span className={"text-on-surface-variant"}>
                    Distribuidor
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    {game.publisher || 'No disponible'}
                  </span>
                </div>
                <div className={"flex justify-between py-1 border-b border-surface-container-highest"}>
                  <span className={"text-on-surface-variant"}>
                    Fecha de Inyección
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    {game.release_date || 'No disponible'}
                  </span>
                </div>
                <div className={"flex justify-between py-1 border-b border-surface-container-highest"}>
                  <span className={"text-on-surface-variant"}>
                    Géneros
                  </span>
                  <span className={"text-primary-container font-semibold"}>
                    {game.categories?.map(nombreCatalogo).filter(Boolean).join(', ') || 'No disponibles'}
                  </span>
                </div>
                <div className={"flex justify-between py-1 border-b border-surface-container-highest"}>
                  <span className={"text-on-surface-variant"}>
                    Voces &amp; Textos
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    Español, Inglés (+12 idiomas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-panel ${activeTab === 'specs' ? '' : 'hidden'} space-y-space-md`} id={"tab-content-specs"} role={"tabpanel"}>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-space-md"}>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-space-sm"}>
              <div className={"flex items-center justify-between pb-2 border-b border-surface-container-highest"}>
                <div className={"flex items-center gap-2 text-on-surface"}>
                  <span className={"material-symbols-outlined text-primary-container"}>
                    laptop_windows
                  </span>
                  <h3 className={"font-headline-sm text-headline-sm font-bold"}>
                    Requisitos Mínimos (1080p / 30 FPS)
                  </h3>
                </div>
                <span className={"font-label-sm text-[10px] px-2 py-0.5 bg-surface-container-highest rounded text-outline"}>
                  LOW PROFILE
                </span>
              </div>
              <div className={"space-y-3 font-body-sm text-body-sm"}>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    SISTEMA OPERATIVO
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    Windows 10 64-bit (v1909 o superior)
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    PROCESADOR (CPU)
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    Core i7-6700 o AMD Ryzen 5 1600
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    MEMORIA RAM
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    12 GB RAM
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    TARJETA GRÁFICA (GPU)
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    NVIDIA GeForce GTX 1060 (6 GB) o AMD Radeon RX 580 (8 GB)
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    ALMACENAMIENTO REQUERIDO
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    70 GB de espacio libre (Se requiere SSD obligatorio)
                  </span>
                </div>
              </div>
            </div>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-space-sm ring-1 ring-primary-container/30"}>
              <div className={"flex items-center justify-between pb-2 border-b border-surface-container-highest"}>
                <div className={"flex items-center gap-2 text-primary-container"}>
                  <span className={"material-symbols-outlined"}>
                    speed
                  </span>
                  <h3 className={"font-headline-sm text-headline-sm font-bold"}>
                    Requisitos Recomendados (1440p / 60 FPS)
                  </h3>
                </div>
                <span className={"font-label-sm text-[10px] px-2 py-0.5 bg-primary-container/20 rounded text-primary-container font-bold"}>
                  OPTIMAL RAY TRACING
                </span>
              </div>
              <div className={"space-y-3 font-body-sm text-body-sm"}>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    SISTEMA OPERATIVO
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    Windows 11 / 10 64-bit
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    PROCESADOR (CPU)
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    Core i7-12700 o AMD Ryzen 7 7800X3D
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    MEMORIA RAM
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    16 GB / 32 GB Dual Channel
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    TARJETA GRÁFICA (GPU)
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    NVIDIA GeForce RTX 3070 / 4070 o AMD Radeon RX 6800 XT
                  </span>
                </div>
                <div>
                  <span className={"font-label-sm text-label-sm text-outline block"}>
                    ALMACENAMIENTO REQUERIDO
                  </span>
                  <span className={"text-on-surface font-semibold"}>
                    70 GB SSD NVMe M.2 de alta velocidad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-panel ${activeTab === 'compatibility' ? '' : 'hidden'} space-y-space-md`} id={"tab-content-compatibility"} role={"tabpanel"}>
          <div className={"grid grid-cols-1 sm:grid-cols-3 gap-space-md"}>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-2"}>
              <div className={"w-10 h-10 rounded-lg bg-secondary-container/10 text-secondary-container flex items-center justify-center"}>
                <span className={"material-symbols-outlined text-2xl"}>
                  check_circle
                </span>
              </div>
              <h3 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Steam Deck: Verificado
              </h3>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Compatibilidad total probada por Valve. Los controles predeterminados funcionan perfectamente y los textos de la interfaz son legibles en la pantalla portátil a 45 FPS constantes.{' '}
              </p>
            </div>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-2"}>
              <div className={"w-10 h-10 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center"}>
                <span className={"material-symbols-outlined text-2xl"}>
                  videogame_asset
                </span>
              </div>
              <h3 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Gatillos Adaptativos PS5
              </h3>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Soporte nativo para retroalimentación háptica DualSense tanto en PlayStation 5 como en PC conectado mediante cable USB-C.{' '}
              </p>
            </div>
            <div className={"bg-surface-container p-space-md rounded-xl space-y-2"}>
              <div className={"w-10 h-10 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center"}>
                <span className={"material-symbols-outlined text-2xl"}>
                  surround_sound
                </span>
              </div>
              <h3 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Dolby Atmos &amp; HDR10
              </h3>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Certificación acústica espacial 3D para rastrear enemigos a través de los muros y masterización HDR calibrada hasta 1000 nits.{' '}
              </p>
            </div>
          </div>
        </div>
        <div className={`tab-panel ${activeTab === 'redemption' ? '' : 'hidden'} space-y-space-md`} id={"tab-content-redemption"} role={"tabpanel"}>
          <div className={"bg-surface-container p-space-md rounded-xl space-y-space-md"}>
            <div>
              <h3 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Protocolo de Inyección de Clave (Paso a Paso)
              </h3>
              <p className={"font-body-sm text-body-sm text-outline"}>
                Cómo activar tu licencia digital tras completar la orden de pago.
              </p>
            </div>
            <div className={"grid grid-cols-1 md:grid-cols-3 gap-space-md"}>
              <div className={"space-y-2 bg-surface-container-low p-space-sm rounded-lg"}>
                <div className={"font-label-sm text-label-sm text-primary-container font-mono"}>
                  FASE 01
                </div>
                <div className={"font-headline-sm text-headline-sm text-on-surface font-semibold"}>
                  Copia la Clave
                </div>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  Accede a 'Mi Bóveda' o a la confirmación de pantalla y presiona 'Copiar Hash'.
                </p>
              </div>
              <div className={"space-y-2 bg-surface-container-low p-space-sm rounded-lg"}>
                <div className={"font-label-sm text-label-sm text-primary-container font-mono"}>
                  FASE 02
                </div>
                <div className={"font-headline-sm text-headline-sm text-on-surface font-semibold"}>
                  Abre el Cliente Steam
                </div>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  Haz clic en el menú superior{' '}
                  <code className={"text-on-surface"}>
                    Productos &gt; Activar un producto en Steam...
                  </code>
                </p>
              </div>
              <div className={"space-y-2 bg-surface-container-low p-space-sm rounded-lg"}>
                <div className={"font-label-sm text-label-sm text-primary-container font-mono"}>
                  FASE 03
                </div>
                <div className={"font-headline-sm text-headline-sm text-on-surface font-semibold"}>
                  Inyección Lista
                </div>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  Pega la clave alfanumérica de 15 caracteres. La descarga comenzará automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"mt-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg"}>
        <div className={"lg:col-span-7 bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-xl space-y-space-md"}>
          <div className={"flex items-center justify-between"}>
            <div>
              <h2 className={"font-headline-md text-headline-md text-on-surface font-bold"}>
                Calificaciones de la Comunidad
              </h2>
              <p className={"font-body-sm text-body-sm text-outline"}>
                Basado en 2,842 compras verificadas en Nexus Keys
              </p>
            </div>
            <div className={"text-right"}>
              <div className={"font-headline-lg text-headline-lg text-secondary-container font-black"}>
                4.9{' '}
                <span className={"text-headline-sm text-outline font-normal"}>
                  / 5.0
                </span>
              </div>
              <div className={"flex items-center gap-0.5 text-secondary-container justify-end"}>
                <span className={"material-symbols-outlined text-sm"} style={{"fontVariationSettings": "'FILL' 1"}}>
                  star
                </span>
                <span className={"material-symbols-outlined text-sm"} style={{"fontVariationSettings": "'FILL' 1"}}>
                  star
                </span>
                <span className={"material-symbols-outlined text-sm"} style={{"fontVariationSettings": "'FILL' 1"}}>
                  star
                </span>
                <span className={"material-symbols-outlined text-sm"} style={{"fontVariationSettings": "'FILL' 1"}}>
                  star
                </span>
                <span className={"material-symbols-outlined text-sm"} style={{"fontVariationSettings": "'FILL' 1"}}>
                  star
                </span>
              </div>
            </div>
          </div>
          <div className={"space-y-space-sm"}>
            <div className={"bg-surface-container p-space-sm rounded-lg space-y-2"}>
              <div className={"flex items-center justify-between"}>
                <div className={"flex items-center gap-2"}>
                  <span className={"font-label-md text-label-md text-on-surface font-bold"}>
                    Kaelen_Void
                  </span>
                  <span className={"px-1.5 py-0.2 bg-secondary-container/20 text-secondary-container font-label-sm text-[9px] rounded font-semibold uppercase"}>
                    Clave Canjeada en Steam
                  </span>
                </div>
                <span className={"font-label-sm text-label-sm text-outline"}>
                  Hace 4 horas
                </span>
              </div>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}"La entrega tardó exactamente 4 segundos después de pagar con tarjeta. Clave global 100% legítima para Steam, el DLC ya está descargado y funciona perfecto en mi Legion Go."{' '}
              </p>
            </div>
            <div className={"bg-surface-container p-space-sm rounded-lg space-y-2"}>
              <div className={"flex items-center justify-between"}>
                <div className={"flex items-center gap-2"}>
                  <span className={"font-label-md text-label-md text-on-surface font-bold"}>
                    CyberSamurai_99
                  </span>
                  <span className={"px-1.5 py-0.2 bg-secondary-container/20 text-secondary-container font-label-sm text-[9px] rounded font-semibold uppercase"}>
                    Clave Canjeada en PS5
                  </span>
                </div>
                <span className={"font-label-sm text-label-sm text-outline"}>
                  Ayer
                </span>
              </div>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}"Precio inmejorable por la Deluxe Neural Edition. Me ahorré casi la mitad y el soporte resolvió mi duda sobre la región en menos de 2 minutos vía chat."{' '}
              </p>
            </div>
          </div>
        </div>
        <div className={"lg:col-span-5 bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-xl space-y-space-md"}>
          <div className={"flex items-center gap-3"}>
            <div className={"w-10 h-10 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0"}>
              <span className={"material-symbols-outlined text-2xl"}>
                verified_user
              </span>
            </div>
            <div>
              <h2 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Proveedor de Clave Certificado
              </h2>
              <div className={"font-label-sm text-label-sm text-secondary-container font-mono"}>
                NODO MAYORISTA #NX-8821
              </div>
            </div>
          </div>
          <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
            {' '}Todas las licencias de este lote son adquiridas directamente a distribuidores autorizados europeos y de Norteamérica autorizados por el publisher. Garantizamos cero riesgo de revocación.{' '}
          </p>
          <div className={"space-y-2 font-label-sm text-label-sm"}>
            <div className={"flex items-center gap-2 text-on-surface"}>
              <span className={"material-symbols-outlined text-base text-secondary-container"}>
                check
              </span>
              <span>
                Validación Criptográfica previa al despacho
              </span>
            </div>
            <div className={"flex items-center gap-2 text-on-surface"}>
              <span className={"material-symbols-outlined text-base text-secondary-container"}>
                check
              </span>
              <span>
                Protección antifraude de tarjeta y monedero Nexus
              </span>
            </div>
            <div className={"flex items-center gap-2 text-on-surface"}>
              <span className={"material-symbols-outlined text-base text-secondary-container"}>
                check
              </span>
              <span>
                Reemplazo automático instantáneo si la clave presenta colisión
              </span>
            </div>
          </div>
          <div className={"pt-2 bg-surface-container p-space-sm rounded-lg flex items-center justify-between"}>
            <div className={"flex items-center gap-2"}>
              <span className={"material-symbols-outlined text-primary-container text-xl"}>
                lock_clock
              </span>
              <span className={"font-label-sm text-label-sm text-on-surface"}>
                Garantía Nexus Shield
              </span>
            </div>
            <span className={"font-label-sm text-label-sm text-primary-container font-bold"}>
              365 DÍAS ACTIVADA
            </span>
          </div>
        </div>
      </div>
      <div className={"fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4"} id={"purchase-modal"}>
        <div className={"bg-surface-container-low max-w-md w-full rounded-xl p-space-lg shadow-2xl border-t-2 border-primary-container space-y-space-md relative"}>
          <button className={"absolute top-4 right-4 text-outline hover:text-on-surface"} type={"button"}>
            <span className={"material-symbols-outlined text-2xl"}>
              close
            </span>
          </button>
          <div className={"flex items-center gap-3"}>
            <div className={"w-10 h-10 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center"}>
              <span className={"material-symbols-outlined text-xl"}>
                vpn_key
              </span>
            </div>
            <div>
              <h3 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>
                Inyección Inmediata
              </h3>
              <p className={"font-body-sm text-body-sm text-outline"}>
                Orden Segura #NX-9428-A
              </p>
            </div>
          </div>
          <div className={"bg-surface-container p-space-sm rounded-lg space-y-2"}>
            <div className={"flex justify-between font-label-sm text-label-sm"}>
              <span className={"text-on-surface-variant"}>
                Producto
              </span>
              <span className={"text-on-surface font-semibold"}>
                Phantom Liberty (Deluxe)
              </span>
            </div>
            <div className={"flex justify-between font-label-sm text-label-sm"}>
              <span className={"text-on-surface-variant"}>
                Plataforma
              </span>
              <span className={"text-primary-container font-semibold"} id={"modal-platform"}>
                Steam PC
              </span>
            </div>
            <div className={"flex justify-between font-label-sm text-label-sm"}>
              <span className={"text-on-surface-variant"}>
                Total a Transferir
              </span>
              <span className={"text-secondary-container font-bold text-headline-sm"} id={"modal-price"}>
                $29.99 USD
              </span>
            </div>
          </div>
          <div className={"space-y-2"}>
            <label className={"font-label-sm text-label-sm text-outline uppercase"}>
              Método de Pago Neural
            </label>
            <div className={"grid grid-cols-2 gap-2"}>
              <button className={"p-2.5 rounded-lg bg-surface-container-highest text-primary-container font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5"} type={"button"}>
                <span className={"material-symbols-outlined text-base"}>
                  credit_card
                </span>
                <span>
                  Tarjeta / Apple
                </span>
              </button>
              <button className={"p-2.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm font-medium flex items-center justify-center gap-1.5 hover:bg-surface-container-high"} type={"button"}>
                <span className={"material-symbols-outlined text-base"}>
                  currency_bitcoin
                </span>
                <span>
                  Crypto / USDT
                </span>
              </button>
            </div>
          </div>
          <button className={"w-full py-3 bg-primary-container text-surface-container-lowest font-headline-sm text-headline-sm font-bold uppercase rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-primary transition-all"} type={"button"}>
            {' '}Proceder al Desbloqueo{' '}
          </button>
          <div className={"text-center font-label-sm text-[10px] text-outline"}>
            {' '}Cifrado cuántico SHA-512 activo. Reembolso inmediato si la clave falla.{' '}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
  )
}

export default DetalleJuego
