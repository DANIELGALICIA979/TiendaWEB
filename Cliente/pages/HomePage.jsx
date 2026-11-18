import { useState } from 'react'
import useCatalogData from '../src/useCatalogData.js'
import { formatoPrecio, nombreCatalogo, ofertasConDescuento } from '../src/catalogUtils.js'
import SiteHeader from '../src/SiteHeader.jsx'
import SiteFooter from '../src/SiteFooter.jsx'

const demoLicense = 'NX89-K27R-99QP-VLT1'

function HomePage({ user, onSignOut }) {
  const [copyStatus, setCopyStatus] = useState('')
  const { catalog, retry } = useCatalogData()
  const games = catalog.games
  const featuredDeals = ofertasConDescuento(games).slice(0, 4)
  const featuredGame = featuredDeals[0]?.game || games[0]
  const featuredOffer = featuredDeals[0]?.offer || featuredGame?.offers?.[0]
  const featuredDiscount = featuredOffer?.original_price > featuredOffer?.price
    ? Math.round((featuredOffer.original_price - featuredOffer.price) / featuredOffer.original_price * 100)
    : 0
  async function handleCopyLicense() {
    try {
      await navigator.clipboard.writeText(demoLicense)
      setCopyStatus('\u00a1COPIADO A NEURAL LINK!')
    } catch {
      setCopyStatus('No se pudo copiar')
    }

    window.setTimeout(() => setCopyStatus(''), 2000)
  }

  return (
    <>
      <style>{`.material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    /* Cyber atmospheric grid lines */
    .cyber-grid {
      background-size: 32px 32px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    .neon-cyan-glow {
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.25);
    }
    .neon-emerald-glow {
      box-shadow: 0 0 16px rgba(52, 255, 141, 0.25);
    }`}</style>
      <div className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-surface-container-lowest min-h-screen flex flex-col cyber-grid">
<SiteHeader user={user} onSignOut={onSignOut} />
{/* MAIN VIEWPORT CANVAS */}
<main className="flex-grow max-w-7xl mx-auto w-full px-space-md lg:px-space-xl py-space-lg space-y-space-xl">
{catalog.status === 'error' && <p className="font-body-sm text-body-sm text-error" role="alert">{catalog.message} <button className="underline" onClick={retry} type="button">Reintentar</button></p>}
{/* HERO SECTION: Featured Game */}
<section className="relative rounded-xl overflow-hidden border border-primary-container/30 bg-surface-container-low shadow-[0_0_24px_rgba(0,240,255,0.1)] group">
{/* Neon Refraction Line at Top Border */}
<div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent z-20 shadow-[0_0_12px_#a855f7]"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] relative">
{/* Hero Visual Media Canvas */}
<div className="lg:col-span-7 relative order-1 lg:order-2 overflow-hidden h-64 lg:h-auto min-h-[280px]">
<img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" src={featuredGame?.banner_url || featuredGame?.cover_url || undefined} alt={featuredGame?.title || 'Juego destacado'}/>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent lg:bg-gradient-to-r lg:from-surface-container-low lg:via-surface-container-low/30 lg:to-transparent"></div>
{/* Live Telemetry Status Pill */}
<div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md border border-secondary-container/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_12px_rgba(52,255,141,0.2)]">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
</span>
<span className="font-label-sm text-label-sm text-secondary-container font-bold tracking-wider">NEURAL KEY VAULT ACTIVE</span>
</div>
</div>
{/* Hero Content Telemetry & Purchase Trigger */}
<div className="lg:col-span-5 p-space-lg lg:p-space-xl flex flex-col justify-between order-2 lg:order-1 relative z-10 bg-surface-container-low/90 backdrop-blur-sm lg:bg-transparent">
<div className="space-y-space-sm">
{/* Platform Tags & Launch Badge */}
<div className="flex flex-wrap items-center gap-2"><span className="bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white font-label-sm text-label-sm px-2.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(147,51,234,0.4)]">JUEGO DESTACADO</span>{featuredDiscount > 0 && <span className="bg-[#dc2626]/20 border border-[#dc2626] text-[#ff8080] font-label-sm text-label-sm px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse"></span>OFERTA {featuredDiscount}%</span>}{nombreCatalogo(featuredOffer?.platform) && <span className="px-2 py-0.5 rounded border border-[#a855f7]/40 bg-[#9333ea]/10 font-label-sm text-label-sm text-[#eacfff] uppercase">{nombreCatalogo(featuredOffer.platform)}</span>}{nombreCatalogo(featuredOffer?.region) && <span className="px-2 py-0.5 rounded border border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">{nombreCatalogo(featuredOffer.region)}</span>}</div>
{/* Title */}
<h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold uppercase tracking-tight text-white leading-none">
              {featuredGame?.title || (catalog.status === 'loading' ? 'Cargando catálogo...' : 'Catálogo sin juegos')}
</h1>
<p className="font-body-md text-body-md text-on-surface-variant">{featuredGame?.description || ''}</p>
{/* Countdown Timer Component */}
<div className="pt-2">
<div className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
<span className="material-symbols-outlined text-xs text-primary-container" data-icon="timer">timer</span> La oferta de estreno finaliza en:
              </div>
<div className="grid grid-cols-4 gap-2 text-center max-w-xs font-label-md">
<div className="bg-surface-container-lowest border border-outline-variant rounded p-1.5">
<div className="text-primary-container font-bold text-lg">04</div>
<div className="text-outline text-[9px] uppercase tracking-wider">Días</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded p-1.5">
<div className="text-primary-container font-bold text-lg">18</div>
<div className="text-outline text-[9px] uppercase tracking-wider">Horas</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded p-1.5">
<div className="text-primary-container font-bold text-lg">42</div>
<div className="text-outline text-[9px] uppercase tracking-wider">Min</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded p-1.5">
<div className="text-secondary-container font-bold text-lg animate-pulse">19</div>
<div className="text-outline text-[9px] uppercase tracking-wider">Seg</div>
</div>
</div>
</div>
</div>
{/* Price & Action Trigger Panel */}
<div className="pt-space-md border-t border-outline-variant/60 space-y-space-sm">
<div className="flex items-center gap-space-md">{featuredDiscount > 0 && <span className="px-2.5 py-1 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white font-headline-sm text-headline-sm font-extrabold rounded shadow-[0_0_14px_rgba(220,38,38,0.5)] border border-[#ef4444]/40">-{featuredDiscount}%</span>}<div className="flex flex-col">{featuredOffer?.original_price > featuredOffer?.price && <span className="font-label-sm text-label-sm text-outline line-through">{formatoPrecio(featuredOffer.original_price, featuredOffer.currency)}</span>}<span className="font-headline-lg text-headline-lg text-primary-container font-bold leading-none">{featuredOffer ? formatoPrecio(featuredOffer.price, featuredOffer.currency) : ''}</span></div><span className="ml-auto px-2.5 py-1 rounded bg-[#9333ea]/20 border border-[#a855f7]/50 text-[#eacfff] font-label-sm text-xs font-semibold flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#c084fc]">verified</span>Llave Autorizada</span></div>
{/* Quick Buy / Pre-order Button */}
<div className="flex flex-col sm:flex-row gap-2 pt-1"><a className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-container via-[#38bdf8] to-primary-container hover:bg-primary text-surface-container-lowest font-label-lg text-label-lg font-bold rounded flex items-center justify-center gap-2 neon-cyan-glow transition-all active:scale-[0.98]" href={featuredGame ? `/carrito?product=${encodeURIComponent(featuredGame.slug)}&edition=${encodeURIComponent(featuredOffer?.id || '')}` : '/carrito'}><span className="material-symbols-outlined text-lg" data-icon="bolt">bolt</span>COMPRAR CLAVE INMEDIATA</a><a className="px-4 py-3 border border-outline-variant text-on-surface rounded flex items-center justify-center font-label-md text-label-md hover:border-primary-container hover:text-primary-container transition-all" href={featuredGame ? `/juego/${featuredGame.slug}` : '/catalogo-completo'}>Ver ficha</a><button className="px-4 py-3 bg-[#9333ea]/15 border border-[#a855f7]/60 hover:bg-[#9333ea]/30 text-[#eacfff] rounded flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)] active:scale-[0.98]" title="Añadir a lista de deseos"><span className="material-symbols-outlined text-[#f472b6]" data-icon="favorite">favorite</span><span className="font-label-sm text-xs font-bold">DESEOS</span></button></div>
</div>
</div>
</div>
</section>
{/* VALUE PROPOSITION BAR (4 Columns) */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-start gap-space-sm hover:border-primary-container/50 transition-colors">
<div className="p-2 rounded bg-surface-container text-primary-container shrink-0">
<span className="material-symbols-outlined text-2xl" data-icon="forward_to_inbox">forward_to_inbox</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Entrega Inmediata</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Recepción ultraveloz en tu bóveda digital y correo en segundos.</p>
</div>
</div>
<div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-start gap-space-sm hover:border-secondary-container/50 transition-colors">
<div className="p-2 rounded bg-surface-container text-secondary-container shrink-0">
<span className="material-symbols-outlined text-2xl" data-icon="verified_user">verified_user</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">100% Claves Legítimas</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Suministradas directamente por distribuidores autorizados.</p>
</div>
</div>
<div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-start gap-space-sm hover:border-tertiary-container/50 transition-colors">
<div className="p-2 rounded bg-surface-container text-tertiary-container shrink-0">
<span className="material-symbols-outlined text-2xl" data-icon="headset_mic">headset_mic</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Soporte 24/7 Gamer</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Atención técnica en tiempo real sin tickets automatizados infinitos.</p>
</div>
</div>
<div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-start gap-space-sm hover:border-primary-container/50 transition-colors">
<div className="p-2 rounded bg-surface-container text-primary-container shrink-0">
<span className="material-symbols-outlined text-2xl" data-icon="security">security</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Pagos Seguros SSL</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Cifrado de grado bancario de 256 bits y antifraude multicapa.</p>
</div>
</div>
</section>
{/* SPECIAL DEALS SECTION (4 COLUMNS GRID) */}
<section className="space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm"><span className="w-1.5 h-5 bg-[#a855f7] inline-block shadow-[0_0_10px_#a855f7]"></span><h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight text-white">Ofertas Destacadas</h2><span className="px-2.5 py-0.5 rounded bg-[#991b1b]/30 text-[#fca5a5] font-label-sm text-label-sm border border-[#dc2626]/70 shadow-[0_0_8px_rgba(220,38,38,0.3)] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping"></span>FLASH DEALS</span></div>
<a className="font-label-md text-label-md text-primary-container hover:underline flex items-center gap-1" href="/catalogo-completo">
          Ver Catálogo Completo <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
{/* 4 Columns Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
{featuredDeals.map(({ game, offer, discount }) => (
<article key={`${game.id}-${offer.id}`} className="bg-surface-container-low border border-[#262638] rounded-lg overflow-hidden flex flex-col justify-between hover:border-primary-container/60 transition-all duration-300 group">
<div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
{(game.banner_url || game.cover_url) && <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={game.banner_url || game.cover_url} alt={game.title} />}
<span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white font-label-md text-label-md font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(220,38,38,0.5)] border border-[#ef4444]/40">-{discount}%</span>
<div className="absolute top-2.5 right-2.5 bg-[#131318]/90 backdrop-blur-sm px-2 py-0.5 rounded border border-[#a855f7]/60 font-label-sm text-label-sm text-[#eacfff] uppercase shadow-[0_0_8px_rgba(168,85,247,0.3)]">{nombreCatalogo(offer.platform) || 'Juego'}</div>
</div>
<div className="p-space-md flex-1 flex flex-col justify-between space-y-space-sm">
<div>
<div className="flex items-center gap-1.5 mb-1"><span className="font-label-sm text-label-sm text-outline uppercase">{game.categories?.map(nombreCatalogo).filter(Boolean).join(' / ') || game.developer || ''}</span></div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">{game.title}</h3>
</div>
<div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
<div><span className="font-label-sm text-label-sm text-outline line-through block">{formatoPrecio(offer.original_price, offer.currency)}</span><span className="font-headline-sm text-headline-sm font-bold text-primary-container">{formatoPrecio(offer.price, offer.currency)}</span></div>
<a className="p-2.5 bg-surface-container hover:bg-primary-container hover:text-surface-container-lowest text-primary-container border border-primary-container/30 rounded transition-all active:scale-[0.98]" title="Ver Ficha" href={`/juego/${game.slug}`}><span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span></a>
</div>
</div>
</article>
))}
</div>
</section>
{/* TWO-COLUMN LAYOUT: TOP SELLERS LEADERBOARD & DIGITAL REVEAL HIGHLIGHT */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
{/* Top Sellers Leaderboard (8 Cols) */}
<div className="lg:col-span-8 space-y-space-md">
<div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container" data-icon="leaderboard">leaderboard</span>
<h2 className="font-headline-md text-headline-md font-bold text-white uppercase tracking-tight">
              Top Sellers Leaderboard
            </h2>
</div>

</div>
<div className="space-y-2">
{games.slice(0, 4).map((game, index) => {
  const offer = ofertasConDescuento([game])[0]?.offer || game.offers?.[0]
  return (
    <div key={game.id} className="p-space-sm bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-between gap-space-md hover:border-primary-container/50 transition-all">
      <div className="flex items-center gap-space-md min-w-0">
        <span className="font-headline-md font-black text-primary-container w-6 text-center">{String(index + 1).padStart(2, '0')}</span>
        <div className="w-12 h-14 bg-surface-container rounded overflow-hidden shrink-0 hidden sm:block">{game.cover_url && <img className="w-full h-full object-cover" src={game.cover_url} alt={game.title} />}</div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-semibold truncate text-white">{game.title}</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary-container font-label-sm text-[10px] uppercase">{nombreCatalogo(offer?.platform) || 'Juego'}</span>
          </div>
          <div className="flex items-center gap-3 text-outline font-label-sm text-label-sm mt-0.5">
            <span className="text-on-surface-variant truncate">{game.developer || game.publisher || ''}</span>
            {nombreCatalogo(offer?.region) && <><span aria-hidden="true">·</span><span className="text-on-surface-variant">{nombreCatalogo(offer.region)}</span></>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-space-md shrink-0">
        <div className="text-right">{offer?.original_price > offer?.price && <span className="font-label-sm text-xs text-outline line-through block">{formatoPrecio(offer.original_price, offer.currency)}</span>}<span className="font-headline-sm text-headline-sm font-bold text-primary-container">{offer ? formatoPrecio(offer.price, offer.currency) : 'Consultar precio'}</span></div>
        <a className="px-3 py-1.5 bg-primary-container/10 border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface-container-lowest rounded font-label-sm text-label-sm font-bold transition-all" href={`/juego/${game.slug}`}>Ver ficha</a>
      </div>
    </div>
  )
})}
</div>
</div>
{/* Neural Vault Preview & Instant Delivery Demo (4 Cols) */}
<div className="lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-xl p-space-md lg:p-space-lg flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-2xl pointer-events-none"></div>
<div className="space-y-space-md">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="lock_open">lock_open</span> Bóveda Instantánea
            </span>
<span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-sm text-[10px]">Cifrado AES-256</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md font-bold text-white mb-1">Entrega Cero Espera</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Cada compra desbloquea de inmediato tu clave de activación en pantalla con botón directo de copia al portapapeles y respaldo por email.
            </p>
</div>
{/* Digital Key Reveal Module (Design System Component) */}
<div className="bg-surface-container-lowest border-2 border-dashed border-[#a855f7]/70 rounded-lg p-space-md space-y-3 shadow-[0_0_18px_rgba(168,85,247,0.18)]"><div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-[#eacfff] uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>Muestra de Licencia</span><span className="font-label-sm text-label-sm text-[#fca5a5] bg-[#991b1b]/20 px-2 py-0.5 rounded border border-[#dc2626]/40">Cifrado Blindado</span></div><div className="font-code-key text-code-key text-center tracking-widest text-[#eacfff] bg-[#9333ea]/15 py-2.5 px-3 rounded border border-[#a855f7]/40 select-all shadow-[inset_0_0_12px_rgba(147,51,234,0.15)]">NX89-K27R-99QP-VLT1</div><button className="w-full py-2 bg-gradient-to-r from-[#9333ea] to-[#7e22ce] hover:from-[#a855f7] hover:to-[#9333ea] text-white border border-[#c084fc]/50 rounded font-label-sm text-label-sm uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_14px_rgba(147,51,234,0.35)]" onClick={handleCopyLicense}><span className="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>{copyStatus || 'Copiar a Neural Link'}</button></div>
</div>
<div className="pt-4 mt-4 border-t border-outline-variant/60 flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-sm text-secondary-container" data-icon="verified">verified</span> Garantía de Reembolso
          </span>
<span>100% Funcional</span>
</div>
</div>
</section>
{/* NEWSLETTER / COMMUNITY UPLINK BANNER */}
<section className="p-space-lg rounded-xl bg-surface-container-lowest border border-[#a855f7]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-[0_0_24px_rgba(147,51,234,0.15)]"><div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#9333ea]/15 rounded-full blur-3xl pointer-events-none"></div><div className="absolute -left-10 -top-10 w-48 h-48 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none"></div><div className="space-y-1 text-center md:text-left relative z-10"><div className="flex items-center gap-2 justify-center md:justify-start"><span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span><span className="font-label-sm text-xs uppercase tracking-wider text-[#eacfff] font-semibold">Drops &amp; Flash Sales</span></div><h3 className="font-headline-md text-headline-md font-bold text-white uppercase">Únete al Enlace Neural de Descuentos</h3><p className="font-body-md text-body-md text-on-surface-variant">Recibe alertas de caídas de precio históricas y drops de claves gratuitas directo en tu bandeja.</p></div><div className="flex w-full md:w-auto max-w-md items-center gap-2 relative z-10"><input className="flex-1 bg-surface-container border border-[#a855f7]/40 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-[#a855f7]" placeholder="tu-correo@nexus.gg" type="email"/><button className="px-5 py-2.5 bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white font-label-md text-label-md font-bold rounded-lg hover:from-[#a855f7] hover:to-[#9333ea] shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all shrink-0">Suscribirme</button></div></section>
</main>
<SiteFooter />






</div>
    </>
  )
}

export default HomePage