import { useState } from 'react'

function Keys() {
  const [toastMessage, setToastMessage] = useState('')

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
<span className={"text-outline"}>ÓRDENES ACTIVAS:</span>
<span className={"text-primary-container font-bold"}>3</span>
</div>
<div className={"bg-surface-container-low border border-outline-variant px-3 py-2 rounded-lg flex items-center gap-2"}>
<span className={"text-outline"}>CLAVES PENDIENTES:</span>
<span className={"text-secondary-fixed-dim font-bold"}>1</span>
</div>
</div>
</div>

<div className={"flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md pt-space-xs border-b border-outline-variant"}>

<div className={"flex items-center gap-space-sm overflow-x-auto pb-[-1px]"}>
<button className={"px-4 py-2 font-label-md text-label-md text-[#c084fc] border-b-2 border-[#9333ea] font-semibold whitespace-nowrap transition-colors duration-150 shadow-[0_2px_8px_rgba(147,51,234,0.3)]"}>Todas las órdenes (3)</button>
<button className={"px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-outline whitespace-nowrap transition-colors duration-150"}>
            Claves no canjeadas (1)
          </button>
<button className={"px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-outline whitespace-nowrap transition-colors duration-150"}>
            Comprobantes fiscales (3)
          </button>
</div>

<div className={"relative w-full md:w-80 pb-2 md:pb-0"}>
<span className={"material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]"} data-icon={"search"}>search</span>
<input className={"w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-8 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"} placeholder={"Buscar por juego u orden #NX..."} type={"text"} />
<span className={"material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[16px]"} data-icon={"filter_list"}>filter_list</span>
</div>
</div>
</section>

<div className={"grid grid-cols-1 lg:grid-cols-12 gap-space-lg"}>

<div className={"lg:col-span-8 flex flex-col gap-space-md"}>

<article className={"bg-surface-container-low border border-[#262638] rounded-xl overflow-hidden relative transition-all duration-200 hover:border-primary-container/40"}>
<div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9333ea] via-[#c084fc]/50 to-transparent"} />

<div className={"px-space-md py-space-sm bg-surface-container-lowest/80 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm"}>
<div className={"flex items-center gap-space-md font-label-sm text-label-sm"}>
<span className={"text-[#c084fc] font-bold flex items-center gap-1"}><span className={"material-symbols-outlined text-[14px]"} data-icon={"tag"}>tag</span>#NX-98241</span>
<span className={"text-outline"}>FECHA: <strong className={"text-on-surface font-normal"}>14 Oct 2024</strong></span>
<span className={"text-outline"}>TOTAL: <strong className={"text-secondary-fixed-dim font-bold"}>$59.99 USD</strong></span>
</div>

<a className={"inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors duration-150"} href={"#"}>
<span className={"material-symbols-outlined text-[16px]"} data-icon={"download"}>download</span>
<span>Descargar Recibo PDF</span>
</a>
</div>

<div className={"p-space-md flex flex-col sm:flex-row gap-space-md"}>

<div className={"w-full sm:w-28 h-32 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-outline-variant"}>
<img className={"w-full h-full object-cover"} data-alt={"A cinematic science fiction video game concept art displaying an astronaut standing on a desolate planetary ridge under a ringed gas giant in deep obsidian space with neon teal cosmic dust reflections."} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuCYGfLy9ci8_FuIsYU9hTbhhvdFoLsaBRE2ej6opBAKBgXS8VXS1onJ2i6t_L6dfjlFarpBGqg1Aq6bkD0jl3Vzq4OCrCHr-RNmq95fm08bP5L3OrYm1uFG0jV5VejdqGiXx3rwY8h-oL9SKZDiY_u84ohBn6PU23XhQXJw48BNYcIdSFNnOAlI48yYPYBbS8S2DMExPGyEplhbJXpfuzW4WUWOQHXKUjSJT_lP_Ot_"} />
<div className={"absolute top-1.5 left-1.5"}>
<span className={"px-1.5 py-0.5 rounded-full text-[9px] font-label-sm border border-primary-container/50 bg-surface-container-lowest/90 text-primary-container font-bold"}>PC</span>
</div>
</div>

<div className={"flex-1 flex flex-col justify-between gap-space-sm"}>
<div>
<div className={"flex items-start justify-between gap-space-sm"}>
<div>
<h2 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>Starfield Digital Deluxe Edition</h2>
<p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>Plataforma: Steam Protocol • Región: Global • Clave sin activar</p>
</div>

<span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-sm border border-secondary-container/60 bg-secondary-container/10 text-secondary-container font-semibold"}>
                    DISPONIBLE
                  </span>
</div>
</div>

<div className={"flex items-center justify-between px-3 py-1.5 rounded bg-[#450a0a]/50 border border-[#dc2626]/50 text-[#fca5a5] font-label-sm text-label-sm"}><div className={"flex items-center gap-1.5"}><span className={"material-symbols-outlined text-[#ef4444] text-[16px]"} data-icon={"warning"}>warning</span><span className={"font-semibold text-[#ef4444]"}>AVISO CRÍTICO:</span><span>Expira en 48h sin canjear en Steam</span></div><span className={"text-[10px] uppercase tracking-wider text-[#f87171] border border-[#dc2626]/40 px-1.5 py-0.5 rounded bg-[#7f1d1d]/40 font-bold"}>ACCIÓN REQUERIDA</span></div><div className={"mt-space-xs p-space-sm rounded-lg bg-surface-container-lowest border border-dashed border-tertiary-container/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm"} id={"key-container-starfield"}>
<div className={"flex items-center gap-space-sm"}>
<span className={"material-symbols-outlined text-tertiary-container"} data-icon={"lock"}>lock</span>
<div>
<div className={"font-label-sm text-label-sm text-outline"}>CÓDIGO DE ACTIVACIÓN CRIPTOGRÁFICO</div>
<div className={"font-code-key text-code-key tracking-wider text-on-surface select-none"} id={"key-display-starfield"}>
                      ••••-••••-••••-••••
                    </div>
</div>
</div>
<div className={"flex items-center gap-space-xs"}>

<button type="button" className={"px-3 py-1.5 rounded bg-[#9333ea]/20 border border-[#9333ea] text-[#d8b4fe] font-label-md text-label-md hover:bg-[#9333ea] hover:text-white transition-all duration-150 flex items-center gap-1 active:scale-[0.98] shadow-[0_0_12px_rgba(147,51,234,0.25)]"} id={"btn-reveal-starfield"} onClick={() => showToast('La clave se mostrará cuando esté disponible desde el backend.')}><span className={"material-symbols-outlined text-[16px]"} data-icon={"visibility"}>visibility</span><span>Revelar Clave</span></button>

<button type="button" className={"px-3 py-1.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:border-outline transition-all duration-150 flex items-center gap-1 active:scale-[0.98]"} id={"btn-copy-starfield"} onClick={() => showToast('No hay una clave disponible para copiar.')}>
<span className={"material-symbols-outlined text-[16px]"} data-icon={"content_copy"}>content_copy</span>
<span>Copiar</span>
</button>
</div>
</div>
</div>
</div>
</article>

<article className={"bg-surface-container-low border border-[#262638] rounded-xl overflow-hidden relative transition-all duration-200 hover:border-primary-container/40"}>
<div className={"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/80 via-transparent to-transparent"} />

<div className={"px-space-md py-space-sm bg-surface-container-lowest/80 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm"}>
<div className={"flex items-center gap-space-md font-label-sm text-label-sm"}>
<span className={"text-primary-container font-bold flex items-center gap-1"}>
<span className={"material-symbols-outlined text-[14px]"} data-icon={"tag"}>tag</span>
                #NX-94102
              </span>
<span className={"text-outline"}>FECHA: <strong className={"text-on-surface font-normal"}>02 Oct 2024</strong></span>
<span className={"text-outline"}>TOTAL: <strong className={"text-secondary-fixed-dim font-bold"}>$44.90 USD</strong></span>
</div>

<a className={"inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors duration-150"} href={"#"}>
<span className={"material-symbols-outlined text-[16px]"} data-icon={"download"}>download</span>
<span>Descargar Recibo PDF</span>
</a>
</div>

<div className={"p-space-md flex flex-col sm:flex-row gap-space-md"}>

<div className={"w-full sm:w-28 h-32 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-outline-variant"}>
<img className={"w-full h-full object-cover"} data-alt={"A grim and atmospheric survival horror artwork featuring a rain-drenched medieval European forest with cold blue lighting, foggy shadows, and a silhouette holding a tactical flashlight."} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuAZBGDksJuHt84sghSxDgR9likgOr1Eo7CQckhH6LGmE-6S8unL5HJFk7ASNoHo3FSoOOB84AKjwWb27esqwwWydSUUu748yVEcCY6Cn1KnGgmoII5_za0wonusG1fbzkZ0FxLXu7ZQtVrozDF9NRuH_nLinqSo4U2RNAzalH-uiYi0pAIRRljqGuVZRfxi16o3tDLCqH6nwpF31A5Bv2h6ZUcAX2ccDFmhiSX7aO_x"} />
<div className={"absolute top-1.5 left-1.5"}>
<span className={"px-1.5 py-0.5 rounded-full text-[9px] font-label-sm border border-blue-400/60 bg-surface-container-lowest/90 text-blue-400 font-bold"}>PS5</span>
</div>
</div>

<div className={"flex-1 flex flex-col justify-between gap-space-sm"}>
<div>
<div className={"flex items-start justify-between gap-space-sm"}>
<div>
<h2 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>Resident Evil 4 Remake</h2>
<p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>Plataforma: PlayStation Network (PS5) • Región: LATAM / NA • Revelada</p>
</div>

<span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-sm border border-secondary-container/60 bg-secondary-container/10 text-secondary-container font-semibold"}>
                    REVELADA
                  </span>
</div>
</div>

<div className={"mt-space-xs p-space-sm rounded-lg bg-surface-container-lowest border border-[#00ff88]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm neon-glow-emerald"}>
<div className={"flex items-center gap-space-sm"}>
<span className={"material-symbols-outlined text-secondary-container"} data-icon={"key"}>key</span>
<div>
<div className={"font-label-sm text-label-sm text-outline"}>LLAVE NEURAL LISTA PARA CANJE</div>
<div className={"font-code-key text-code-key tracking-wider text-secondary-fixed-dim font-bold select-all"} id={"key-display-re4"}>
                      RE4R-8821-K992-XPL0
                    </div>
</div>
</div>
<div className={"flex items-center gap-space-xs"}>

<button type="button" className={"px-3.5 py-1.5 rounded bg-secondary-container text-on-secondary font-label-md text-label-md font-bold hover:bg-secondary-fixed transition-all duration-150 flex items-center gap-1 active:scale-[0.98]"} onClick={() => copyCode('RE4R-8821-K992-XPL0')}>
<span className={"material-symbols-outlined text-[16px]"} data-icon={"content_copy"}>content_copy</span>
<span>Copiar Clave</span>
</button>
</div>
</div>
</div>
</div>
</article>

<article className={"bg-surface-container-low/70 border border-[#262638] rounded-xl overflow-hidden relative transition-all duration-200 opacity-90 hover:opacity-100"}>
<div className={"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-outline-variant via-transparent to-transparent"} />

<div className={"px-space-md py-space-sm bg-surface-container-lowest/80 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm"}>
<div className={"flex items-center gap-space-md font-label-sm text-label-sm"}>
<span className={"text-on-surface font-bold flex items-center gap-1"}>
<span className={"material-symbols-outlined text-[14px]"} data-icon={"tag"}>tag</span>
                #NX-91044
              </span>
<span className={"text-outline"}>FECHA: <strong className={"text-on-surface font-normal"}>28 Sep 2024</strong></span>
<span className={"text-outline"}>TOTAL: <strong className={"text-on-surface font-bold"}>$29.99 USD</strong></span>
</div>

<a className={"inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors duration-150"} href={"#"}>
<span className={"material-symbols-outlined text-[16px]"} data-icon={"download"}>download</span>
<span>Descargar Recibo PDF</span>
</a>
</div>

<div className={"p-space-md flex flex-col sm:flex-row gap-space-md"}>

<div className={"w-full sm:w-28 h-32 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-outline-variant grayscale-[30%]"}>
<img className={"w-full h-full object-cover"} data-alt={"A dark cyberpunk futuristic metropolis with bright yellow and cyan holographic neon signage, rainy streets reflecting synthetic light, and high-tech combat operatives."} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuARzxV5xtBZBPbtEKKZO1wBfb8jC58aEDTR7IOGwJCIhRYVjsSBI0VH5-1W16vFY4k7YiGj2_9DhnQWRa9Ze9l7SdjRNRNzXRmD-hcUGsihy7Pc6HhN-KKqy8_k_mLLBZU8ywGsqZC4GORX3FCtF9UryrWkBn0jax0ZJI-x2jZkRlq1w8Y-T8bY2idKy66b8anbqshy8wO9EfL8DGzTOhm_KBsOMNtQV0V22De6k9LT"} />
<div className={"absolute top-1.5 left-1.5"}>
<span className={"px-1.5 py-0.5 rounded-full text-[9px] font-label-sm border border-outline bg-surface-container-lowest/90 text-on-surface-variant font-bold"}>GOG</span>
</div>
</div>

<div className={"flex-1 flex flex-col justify-between gap-space-sm"}>
<div>
<div className={"flex items-start justify-between gap-space-sm"}>
<div>
<h2 className={"font-headline-sm text-headline-sm text-on-surface font-bold"}>Cyberpunk 2077: Phantom Liberty (DLC)</h2>
<p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>Plataforma: GOG Galaxy • Región: Global • Clave transferida al inventario</p>
</div>

<span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-sm border border-outline text-outline font-semibold"}>
                    CANJEADA CON ÉXITO
                  </span>
</div>
</div>

<div className={"mt-space-xs p-space-sm rounded-lg bg-surface-container-lowest/60 border border-outline-variant flex items-center justify-between"}>
<div className={"flex items-center gap-space-sm"}>
<span className={"material-symbols-outlined text-outline"} data-icon={"check_circle"}>check_circle</span>
<div>
<div className={"font-label-sm text-label-sm text-outline"}>ESTADO DE CANJE REGISTRADO</div>
<div className={"font-code-key text-code-key text-outline line-through select-none"}>
                      CP77-PLIB-8012-VLT9
                    </div>
</div>
</div>
<div className={"font-label-sm text-label-sm text-outline"}>
                  Sincronizado: 28/09/2024
                </div>
</div>
</div>
</div>
</article>
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
