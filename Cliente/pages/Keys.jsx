import { useEffect, useMemo, useState } from 'react'
import { obtenerClavesCompradas } from '../services/api.js'
import { formatoPrecio } from '../src/catalogUtils.js'

function Keys() {
  const [toastMessage, setToastMessage] = useState('')
  const [keys, setKeys] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [revealedKeys, setRevealedKeys] = useState({})

  useEffect(() => {
    let active = true
    obtenerClavesCompradas()
      .then(result => {
        if (active) {
          setKeys(result)
          setStatus('ready')
        }
      })
      .catch(error => {
        if (active) {
          setErrorMessage(error.message)
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const purchases = useMemo(() => {
    const groups = new Map()
    keys.forEach(key => {
      const groupKey = [
        key.orderId,
        key.gameTitle,
        key.platform,
        key.region,
        key.edition,
        key.unitPrice,
      ].join('|')
      const purchase = groups.get(groupKey)
      if (purchase) {
        purchase.keys.push(key)
      } else {
        groups.set(groupKey, { ...key, keys: [key] })
      }
    })
    return Array.from(groups.values())
  }, [keys])

  const filteredPurchases = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase('es-MX')
    if (!search) return purchases
    return purchases.filter(purchase =>
      [purchase.gameTitle, purchase.orderNumber, purchase.platform, purchase.region]
        .some(value => value?.toLocaleLowerCase('es-MX').includes(search)),
    )
  }, [purchases, searchTerm])

  const orderCount = new Set(keys.map(key => key.orderId)).size

  function showToast(message) {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 2600)
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      showToast('Clave copiada al portapapeles.')
    } catch (error) {
      showToast(`No se pudo copiar la clave: ${error.message}`)
    }
  }

  function toggleReveal(keyId) {
    setRevealedKeys(current => ({ ...current, [keyId]: !current[keyId] }))
  }

  return (
    <div className={"bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-surface-container-lowest antialiased"}>


<main className={"flex-1 w-full max-w-7xl mx-auto px-space-md lg:px-space-xl py-space-lg flex flex-col gap-space-lg cyber-scanline"}>

<section className={"flex flex-col gap-space-md"}>

<div className={"flex items-center gap-space-xs text-outline font-label-sm text-label-sm"}>
<span className={"text-primary-container uppercase"}>VAULT_SUBSYSTEM</span>
<span>/</span>
<span>NEURAL_TRANSACTIONS</span>
<span>/</span>
<span className={"text-on-surface"}>ID_6749_AUTH</span>
</div>

<div className={"flex flex-col lg:flex-row lg:items-end justify-between gap-space-md"}>
<div>
<h1 className={"font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-space-sm"}>
<span>Historial de Compras &amp; Bóveda de Claves</span>
<span className={"hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-sm border border-secondary-container text-secondary-container bg-surface-container-lowest"}>
              SISTEMA EN LÍNEA
            </span>
</h1>
<p className={"font-body-md text-body-md text-on-surface-variant mt-1"}>
            Visualiza, revela y activa tus licencias criptográficas de forma instantánea. Transmisión segura con garantía anti-revocación.
          </p>
</div>

<div className={"flex items-center gap-space-sm font-label-sm text-label-sm"}>
<div className={"bg-surface-container-low border border-outline-variant px-3 py-2 rounded-lg flex items-center gap-2"}>
<span className={"text-outline"}>ÓRDENES COMPLETADAS:</span>
<span className={"text-primary-container font-bold"}>{orderCount}</span>
</div>
<div className={"bg-surface-container-low border border-outline-variant px-3 py-2 rounded-lg flex items-center gap-2"}>
<span className={"text-outline"}>KEYS ASIGNADAS:</span>
<span className={"text-secondary-fixed-dim font-bold"}>{keys.length}</span>
</div>
</div>
</div>

<div className={"flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md pt-space-xs border-b border-outline-variant"}>

<div className={"flex items-center gap-space-sm overflow-x-auto pb-[-1px]"}>
<button className={"px-4 py-2 font-label-md text-label-md text-[#c084fc] border-b-2 border-[#9333ea] font-semibold whitespace-nowrap transition-colors duration-150 shadow-[0_2px_8px_rgba(147,51,234,0.3)]"}>Todas las órdenes ({orderCount})</button>
<button className={"px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-outline whitespace-nowrap transition-colors duration-150"}>
            Keys entregadas ({keys.length})
          </button>
<button className={"px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-outline whitespace-nowrap transition-colors duration-150"}>
            Órdenes completadas ({orderCount})
          </button>
</div>

<div className={"relative w-full md:w-80 pb-2 md:pb-0"}>
<span className={"material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]"} data-icon={"search"}>search</span>
<input className={"w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-8 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"} placeholder={"Buscar por juego u orden #NX..."} type={"text"} value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
<span className={"material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[16px]"} data-icon={"filter_list"}>filter_list</span>
</div>
</div>
</section>

<div className={"grid grid-cols-1 lg:grid-cols-12 gap-space-lg"}>

<div className={"lg:col-span-8 flex flex-col gap-space-md"}>
{status === 'loading' && <div className={"bg-surface-container-low border border-outline-variant rounded-xl p-space-lg text-center text-on-surface-variant"} role="status">Cargando tus compras y keys...</div>}
{status === 'error' && <div className={"bg-surface-container-low border border-error/50 rounded-xl p-space-lg text-center"} role="alert"><h2 className={"font-headline-sm text-headline-sm text-error"}>No se pudo cargar tu bóveda</h2><p className={"font-body-sm text-body-sm text-on-surface-variant mt-2"}>{errorMessage}</p></div>}
{status === 'ready' && filteredPurchases.length === 0 && (
  <div className={"bg-surface-container-low border border-outline-variant rounded-xl p-space-lg text-center"}>
    <span className={"material-symbols-outlined text-primary-container text-4xl"} data-icon={"videogame_asset"}>videogame_asset</span>
    <h2 className={"font-headline-sm text-headline-sm text-on-surface mt-space-sm"}>{searchTerm ? 'No encontramos resultados' : 'Tu bóveda está vacía'}</h2>
    <p className={"font-body-sm text-body-sm text-on-surface-variant mt-2"}>{searchTerm ? 'Prueba con otro juego o número de orden.' : 'Cuando completes una compra, tus juegos y keys aparecerán aquí.'}</p>
    {!searchTerm && <a className={"inline-flex items-center gap-2 mt-space-md px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md"} href={"/catalogo-completo"}>Explorar catálogo<span className={"material-symbols-outlined text-[18px]"}>arrow_forward</span></a>}
  </div>
)}
{status === 'ready' && filteredPurchases.map(purchase => (
  <article className={"bg-surface-container-low border border-[#262638] rounded-xl overflow-hidden relative transition-all duration-200 hover:border-primary-container/40"} key={`${purchase.orderId}-${purchase.id}`}>
    <div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9333ea] via-[#c084fc]/50 to-transparent"} />
    <div className={"px-space-md py-space-sm bg-surface-container-lowest/80 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm"}>
      <div className={"flex flex-wrap items-center gap-space-md font-label-sm text-label-sm"}>
        <span className={"text-[#c084fc] font-bold flex items-center gap-1 break-all"}><span className={"material-symbols-outlined text-[14px]"} data-icon={"tag"}>tag</span>#{purchase.orderNumber}</span>
        <span className={"text-outline"}>FECHA: <strong className={"text-on-surface font-normal"}>{new Date(purchase.purchasedAt).toLocaleDateString('es-MX')}</strong></span>
        <span className={"text-outline"}>TOTAL DEL PRODUCTO: <strong className={"text-secondary-fixed-dim font-bold"}>{formatoPrecio(purchase.unitPrice * purchase.keys.length)}</strong></span>
      </div>
      <span className={"inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary-container"}><span className={"material-symbols-outlined text-[16px]"}>verified</span>Pago simulado</span>
    </div>
    <div className={"p-space-md flex flex-col sm:flex-row gap-space-md"}>
      <div className={"w-full sm:w-28 h-32 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-outline-variant"}>
        {purchase.coverUrl ? <img className={"w-full h-full object-cover"} alt={`Portada de ${purchase.gameTitle}`} src={purchase.coverUrl} /> : <div className={"w-full h-full flex items-center justify-center text-outline"}><span className={"material-symbols-outlined text-4xl"}>sports_esports</span></div>}
        <div className={"absolute top-1.5 left-1.5"}><span className={"px-1.5 py-0.5 rounded-full text-[9px] font-label-sm border border-primary-container/50 bg-surface-container-lowest/90 text-primary-container font-bold"}>{purchase.platform}</span></div>
      </div>
      <div className={"flex-1 flex flex-col justify-between gap-space-sm"}>
        <div className={"flex items-start justify-between gap-space-sm"}>
          <div>
            <h2 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>{purchase.gameTitle}</h2>
            <p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>Plataforma: {purchase.platform} • Región: {purchase.region} • Edición: {purchase.edition || 'Estándar'} • {purchase.keys.length} {purchase.keys.length === 1 ? 'unidad' : 'unidades'}</p>
          </div>
          <span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-sm border border-secondary-container/60 bg-secondary-container/10 text-secondary-container font-semibold whitespace-nowrap"}>KEY ASIGNADA</span>
        </div>
        <div className={"flex flex-col gap-space-xs"}>
          {purchase.keys.map((key, index) => (
            <div className={"p-space-sm rounded-lg bg-surface-container-lowest border border-dashed border-tertiary-container/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm"} key={key.id}>
              <div className={"flex items-center gap-space-sm min-w-0"}>
                <span className={"material-symbols-outlined text-tertiary-container"} data-icon={"key"}>key</span>
                <div className={"min-w-0"}>
                  <div className={"font-label-sm text-label-sm text-outline"}>KEY DE ACTIVACIÓN {purchase.keys.length > 1 ? `${index + 1} DE ${purchase.keys.length}` : ''}</div>
                  <div className={"font-code-key text-code-key tracking-wider text-on-surface break-all"}>{revealedKeys[key.id] ? key.key : (key.keyHint ? `\u2022\u2022\u2022\u2022-${key.keyHint}` : '\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022')}</div>
                </div>
              </div>
              <div className={"flex items-center gap-space-xs flex-shrink-0"}>
                <button type="button" className={"px-3 py-1.5 rounded bg-[#9333ea]/20 border border-[#9333ea] text-[#d8b4fe] font-label-md text-label-md hover:bg-[#9333ea] hover:text-white transition-all duration-150 flex items-center gap-1"} onClick={() => toggleReveal(key.id)}><span className={"material-symbols-outlined text-[16px]"}>{revealedKeys[key.id] ? 'visibility_off' : 'visibility'}</span><span>{revealedKeys[key.id] ? 'Ocultar' : 'Revelar'}</span></button>
                <button type="button" className={"px-3 py-1.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:border-outline transition-all duration-150 flex items-center gap-1"} onClick={() => copyCode(key.key)}><span className={"material-symbols-outlined text-[16px]"} data-icon={"content_copy"}>content_copy</span><span>Copiar</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </article>
))}
</div>

<aside className={"lg:col-span-4 flex flex-col gap-space-md"}>

<section className={"bg-surface-container-low border border-[#262638] rounded-xl p-space-md relative overflow-hidden"}>
<div className={"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary-container/60 to-transparent"} />
<div className={"flex items-center gap-space-sm mb-space-sm"}>
<span className={"material-symbols-outlined text-primary-container"} data-icon={"terminal"}>terminal</span>
<h3 className={"font-headline-sm text-headline-sm text-on-surface"}>Guía de Activación Rápida</h3>
</div>
<p className={"font-body-sm text-body-sm text-on-surface-variant mb-space-md"}>
            Sigue los protocolos estándar de canje según el ecosistema seleccionado para evitar bloqueos regionales:
          </p>
<ul className={"flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface"}>
<li className={"flex items-start gap-space-xs p-2 rounded bg-surface-container-lowest border border-outline-variant/50"}>
<span className={"material-symbols-outlined text-primary-container text-[18px] mt-0.5"} data-icon={"sports_esports"}>sports_esports</span>
<div>
<strong className={"font-semibold text-primary"}>Steam:</strong> Abre cliente &gt; Menú "Juegos" &gt; "Activar un producto en Steam".
              </div>
</li>
<li className={"flex items-start gap-space-xs p-2 rounded bg-surface-container-lowest border border-outline-variant/50"}>
<span className={"material-symbols-outlined text-blue-400 text-[18px] mt-0.5"} data-icon={"videogame_asset"}>videogame_asset</span>
<div>
<strong className={"font-semibold text-blue-300"}>PlayStation Store:</strong> Accede a tu perfil &gt; Canjear código (12 dígitos numéricos).
              </div>
</li>
<li className={"flex items-start gap-space-xs p-2 rounded bg-surface-container-lowest border border-outline-variant/50"}>
<span className={"material-symbols-outlined text-secondary-fixed-dim text-[18px] mt-0.5"} data-icon={"stadia_controller"}>stadia_controller</span>
<div>
<strong className={"font-semibold text-secondary-fixed-dim"}>Xbox / Microsoft:</strong> Abre Microsoft Store &gt; Presiona botón 'Canjear Código'.
              </div>
</li>
</ul>
</section>

<section className={"bg-surface-container-low border border-[#262638] rounded-xl p-space-md relative overflow-hidden"}>
<div className={"flex items-center justify-between mb-space-sm"}><div className={"flex items-center gap-space-sm"}><span className={"material-symbols-outlined text-secondary-container"} data-icon={"shield"}>shield</span><h3 className={"font-headline-sm text-headline-sm text-on-surface"}>Nexus Shield: Garantía Total</h3></div><span className={"px-2 py-0.5 rounded text-[10px] font-label-sm border border-[#dc2626] bg-[#450a0a]/60 text-[#fca5a5] flex items-center gap-1 font-semibold"}><span className={"material-symbols-outlined text-[12px] text-[#ef4444]"} data-icon={"verified_user"}>verified_user</span>BLINDAJE ACTIVO</span></div>
<p className={"font-body-sm text-body-sm text-on-surface-variant mb-space-md"}>
            Todas las compras cuentan con respaldo de entrega inmediata y reemplazo automatizado en caso de colisión de licencia o desajuste regional.
          </p>
<div className={"grid grid-cols-2 gap-space-xs font-label-sm text-label-sm text-outline mb-space-md"}>
<div className={"p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex flex-col"}>
<span className={"text-on-surface font-semibold"}>COBERTURA</span>
<span className={"text-secondary-fixed-dim"}>365 Días Activa</span>
</div>
<div className={"p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex flex-col"}>
<span className={"text-on-surface font-semibold"}>TIPO DE CLAVE</span>
<span className={"text-primary-container"}>Retail Oficial</span>
</div>
</div>

<a className={"w-full py-2.5 px-4 rounded bg-gradient-to-r from-[#7f1d1d]/40 via-surface-container-high to-[#581c87]/40 border border-[#dc2626]/60 hover:border-[#ef4444] text-[#fca5a5] hover:text-white font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs transition-all duration-150 active:scale-[0.98] shadow-[0_0_14px_rgba(220,38,38,0.2)]"} href={"#"}><span className={"material-symbols-outlined text-[18px] text-[#ef4444]"} data-icon={"emergency"}>emergency</span><span>Canal Rojo: Soporte Crítico 24/7</span></a>
</section>
</aside>
</div>
</main>

<div className={`fixed bottom-6 right-6 bg-surface-container-lowest border border-secondary-container text-secondary-container px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(52,255,141,0.35)] flex items-center gap-2 font-label-md text-label-md transition-all duration-300 z-50 ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} id={"cyber-toast"} aria-live="polite">
<span className={"material-symbols-outlined text-[18px]"} data-icon={"check_circle"}>check_circle</span>
<span id={"toast-message"}>{toastMessage}</span>
</div>





</div>
  )
}

export default Keys
