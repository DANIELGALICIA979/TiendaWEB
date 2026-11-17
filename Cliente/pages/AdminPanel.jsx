import { useState } from 'react'

function AdminPanel() {
  const [statusMessage, setStatusMessage] = useState('')

  async function handleAdminClick(event) {
    const button = event.target instanceof Element
      ? event.target.closest('button')
      : null
    const label = button?.textContent?.trim().toLowerCase() || ''

    if (label.includes('copiar serial')) {
      try {
        await navigator.clipboard.writeText('CYBR-77PL-9920-NX84-VOID')
        setStatusMessage('Serial copiado al portapapeles.')
      } catch (error) {
        setStatusMessage(`No se pudo copiar el serial: ${error.message}`)
      }
    } else if (label.includes('publicar nuevo videojuego')) {
      document.getElementById('game-form')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleSave(event) {
    event.preventDefault()
    setStatusMessage('El endpoint para guardar videojuegos todavía no está conectado.')
  }

  return (
    <div className={"bg-background text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-surface-container-lowest"} onClick={handleAdminClick}>


<main className={"flex-1 w-full max-w-7xl mx-auto px-space-md lg:px-space-xl py-space-lg flex flex-col gap-space-lg"}>

<div className={"flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant"}>
<div>
<div className={"flex items-center gap-space-sm mb-1"}><span className={"px-2 py-0.5 font-label-sm text-label-sm bg-[#9333ea]/20 text-[#c084fc] border border-[#a855f7]/50 rounded font-semibold"}>ADMIN CONSOLE v4.8</span><div className={"flex items-center gap-1.5 font-label-sm text-label-sm text-[#dc2626] bg-[#dc2626]/10 px-2 py-0.5 rounded border border-[#dc2626]/30"}><span className={"w-1.5 h-1.5 rounded-full bg-[#ef4444]"} /><span>ALERTA DE SEGURIDAD: NIVEL 1</span></div></div>
<h1 className={"font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight"}>Panel de Control &amp; <span className={"text-[#c084fc] border-b-2 border-[#9333ea] pb-0.5"}>Gestión de Ventas</span></h1>
</div>

<div className={"flex items-center flex-wrap gap-space-sm"}>
<button className={"px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant rounded font-label-md text-label-md flex items-center gap-2 transition-all duration-150 active:scale-[0.98]"}>
<span className={"material-symbols-outlined text-[18px] text-on-surface-variant"}>file_download</span>
<span>Exportar Reporte Financiero (CSV/PDF)</span>
</button>
<button className={"px-4 py-2.5 bg-primary-container hover:bg-secondary-container text-surface-container-lowest font-label-md text-label-md font-bold rounded flex items-center gap-2 transition-all duration-150 shadow-[0_0_14px_rgba(0,240,255,0.4)] active:scale-[0.98]"}>
<span className={"material-symbols-outlined text-[18px]"}>add_circle</span>
<span>+ Publicar Nuevo Videojuego</span>
</button>
</div>
</div>

<section className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"}>

<div className={"relative bg-surface-container-low border border-outline-variant p-space-md rounded-lg overflow-hidden flex flex-col justify-between hover:border-primary-container/40 transition-colors"}>
<div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-container via-primary to-transparent"} />
<div>
<div className={"flex items-center justify-between text-on-surface-variant mb-1"}>
<span className={"font-label-sm text-label-sm uppercase tracking-wider"}>Ventas Totales Netas</span>
<span className={"material-symbols-outlined text-[18px] text-primary-container"}>query_stats</span>
</div>
<div className={"flex items-baseline gap-2 mt-2"}>
<span className={"font-headline-lg text-headline-lg text-on-surface tracking-tight"}>$48,920</span>
<span className={"font-label-sm text-label-sm text-primary-container uppercase"}>USD</span>
</div>
<div className={"flex items-center gap-1.5 mt-2 font-label-sm text-label-sm text-secondary-fixed-dim"}>
<span className={"material-symbols-outlined text-[14px]"}>trending_up</span>
<span>+18% vs ayer</span>
<span className={"text-on-surface-variant font-body-sm text-body-sm"}>(pico 21:00h)</span>
</div>
</div>

<div className={"flex items-end gap-1 h-6 mt-4 pt-2 border-t border-surface-container-highest"}>
<div className={"w-full bg-outline-variant/40 rounded-t h-[30%]"} />
<div className={"w-full bg-outline-variant/40 rounded-t h-[45%]"} />
<div className={"w-full bg-outline-variant/40 rounded-t h-[60%]"} />
<div className={"w-full bg-primary-container/70 rounded-t h-[80%]"} />
<div className={"w-full bg-primary-container rounded-t h-[100%] shadow-[0_0_8px_rgba(0,240,255,0.5)]"} />
<div className={"w-full bg-primary-container/80 rounded-t h-[75%]"} />
<div className={"w-full bg-primary-container/60 rounded-t h-[65%]"} />
</div>
</div>

<div className={"relative bg-surface-container-low border border-outline-variant p-space-md rounded-lg overflow-hidden flex flex-col justify-between hover:border-secondary-container/40 transition-colors"}>
<div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary-container via-secondary-fixed-dim to-transparent"} />
<div>
<div className={"flex items-center justify-between text-on-surface-variant mb-1"}>
<span className={"font-label-sm text-label-sm uppercase tracking-wider"}>Claves Digitales Vendidas</span>
<span className={"material-symbols-outlined text-[18px] text-secondary-container"}>vpn_key</span>
</div>
<div className={"flex items-baseline gap-2 mt-2"}>
<span className={"font-headline-lg text-headline-lg text-on-surface tracking-tight"}>1,420</span>
<span className={"font-label-sm text-label-sm text-on-surface-variant"}>SERIALES</span>
</div>
<div className={"flex items-center gap-1.5 mt-2 font-label-sm text-label-sm text-secondary-container"}>
<span className={"material-symbols-outlined text-[14px]"}>check_circle</span>
<span>99.8% canjeadas con éxito</span>
</div>
</div>
<div className={"w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden"}>
<div className={"bg-secondary-container h-full rounded-full w-[99.8%] shadow-[0_0_6px_#34ff8d]"} />
</div>
</div>

<div className={"relative bg-surface-container-low border border-[#dc2626]/50 p-space-md rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#ef4444] transition-colors"}><div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-transparent"} /><div><div className={"flex items-center justify-between text-on-surface-variant mb-1"}><span className={"font-label-sm text-label-sm uppercase tracking-wider text-[#ef4444]"}>Catálogo Activo</span><span className={"material-symbols-outlined text-[18px] text-[#ef4444]"}>sports_esports</span></div><div className={"flex items-baseline gap-2 mt-2"}><span className={"font-headline-lg text-headline-lg text-on-surface tracking-tight"}>85</span><span className={"font-label-sm text-label-sm text-on-surface-variant"}>JUEGOS</span></div><div className={"flex items-center gap-1.5 mt-2 font-label-sm text-label-sm text-[#fca5a5] bg-[#dc2626]/20 px-2 py-0.5 rounded border border-[#dc2626]/40"}><span className={"material-symbols-outlined text-[14px] text-[#ef4444]"}>warning</span><span className={"font-semibold text-[#fecaca]"}>12 en stock bajo de claves</span></div></div><div className={"flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-4 pt-2 border-t border-[#dc2626]/30"}><span>Buffer disponible:</span><span className={"text-[#ef4444] font-semibold"}>4,890 claves</span></div></div>

<div className={"relative bg-surface-container-low border border-[#9333ea]/60 p-space-md rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#a855f7] transition-colors shadow-[0_0_12px_rgba(147,51,234,0.25)]"}><div className={"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-transparent"} /><div><div className={"flex items-center justify-between text-on-surface-variant mb-1"}><span className={"font-label-sm text-label-sm uppercase tracking-wider text-[#c084fc]"}>Margen de Ganancia</span><span className={"material-symbols-outlined text-[18px] text-[#a855f7]"}>percent</span></div><div className={"flex items-baseline gap-2 mt-2"}><span className={"font-headline-lg text-headline-lg text-on-surface tracking-tight"}>24.5%</span><span className={"font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#9333ea]/20 text-[#c084fc] border border-[#a855f7]/40 font-bold uppercase"}>NETO</span></div><div className={"flex items-center gap-1.5 mt-2 font-label-sm text-label-sm text-[#c084fc]"}><span className={"material-symbols-outlined text-[14px] text-[#a855f7]"}>account_balance_wallet</span><span>Neto acumulado auditado</span></div></div><div className={"flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-4 pt-2 border-t border-[#9333ea]/30"}><span>Fee de red:</span><span className={"text-[#a855f7] font-semibold"}>1.2% Optimizado</span></div></div>
</section>

<div className={"grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start"}>

<section className={"lg:col-span-5 bg-surface-container-low border border-outline-variant rounded-lg p-space-lg relative shadow-md"} id="game-form">

<div className={"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary-container via-transparent to-transparent"} />
<div className={"flex items-center justify-between mb-space-md pb-space-sm border-b border-surface-container-highest"}><div className={"flex items-center gap-2"}><span className={"material-symbols-outlined text-[#a855f7] text-[20px]"}>add_box</span><h2 className={"font-headline-sm text-headline-sm text-on-surface"}>Formulario Rápido: <span className={"text-[#c084fc]"}>Alta de Videojuego</span></h2></div><span className={"font-label-sm text-label-sm text-[#c084fc] bg-[#9333ea]/20 border border-[#9333ea]/40 px-2 py-0.5 rounded uppercase"}>MODO INGESTA</span></div>
<form className={"flex flex-col gap-space-md"} onSubmit={handleSave}>

<div>
<label className={"block font-label-md text-label-md text-on-surface-variant mb-1.5"} htmlFor={"game-title"}>
              Título del Videojuego *
            </label>
<div className={"relative"}>
<input className={"w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface rounded p-2.5 font-body-md text-body-md placeholder:text-outline transition-colors outline-none"} id={"game-title"} placeholder={"Ej. Cyberpunk 2077: Phantom Liberty"} type={"text"} />
<span className={"material-symbols-outlined absolute right-2.5 top-2.5 text-outline-variant text-[18px]"}>videogame_asset</span>
</div>
</div>

<div>
<label className={"block font-label-md text-label-md text-on-surface-variant mb-1.5"}>
              Plataforma &amp; Ecosistema *
            </label>
<div className={"grid grid-cols-3 sm:grid-cols-5 gap-1.5"}>
<label className={"flex flex-col items-center justify-center p-2 rounded border border-primary-container bg-surface-container-lowest text-primary-container cursor-pointer text-center"}>
<input defaultChecked={true} className={"sr-only"} name={"platform"} type={"radio"} defaultValue={"Steam"} />
<span className={"font-label-sm text-label-sm font-bold"}>STEAM</span>
<span className={"text-[9px] text-outline"}>PC Digital</span>
</label>
<label className={"flex flex-col items-center justify-center p-2 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline cursor-pointer text-center"}>
<input className={"sr-only"} name={"platform"} type={"radio"} defaultValue={"PSN"} />
<span className={"font-label-sm text-label-sm font-bold"}>PSN</span>
<span className={"text-[9px] text-outline"}>PS5 / PS4</span>
</label>
<label className={"flex flex-col items-center justify-center p-2 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline cursor-pointer text-center"}>
<input className={"sr-only"} name={"platform"} type={"radio"} defaultValue={"Xbox"} />
<span className={"font-label-sm text-label-sm font-bold"}>XBOX</span>
<span className={"text-[9px] text-outline"}>Series X|S</span>
</label>
<label className={"flex flex-col items-center justify-center p-2 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline cursor-pointer text-center"}>
<input className={"sr-only"} name={"platform"} type={"radio"} defaultValue={"Switch"} />
<span className={"font-label-sm text-label-sm font-bold"}>SWITCH</span>
<span className={"text-[9px] text-outline"}>Nintendo</span>
</label>
<label className={"flex flex-col items-center justify-center p-2 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline cursor-pointer text-center"}>
<input className={"sr-only"} name={"platform"} type={"radio"} defaultValue={"GOG"} />
<span className={"font-label-sm text-label-sm font-bold"}>GOG</span>
<span className={"text-[9px] text-outline"}>DRM Free</span>
</label>
</div>
</div>

<div className={"grid grid-cols-1 sm:grid-cols-2 gap-space-sm"}>
<div>
<label className={"block font-label-md text-label-md text-on-surface-variant mb-1.5"} htmlFor={"price"}>
                Precio Sugerido ($ USD)
              </label>
<div className={"relative"}>
<span className={"absolute left-3 top-2.5 font-label-md text-label-md text-on-surface-variant"}>$</span>
<input className={"w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface rounded pl-7 pr-3 py-2.5 font-label-md text-label-md placeholder:text-outline outline-none"} id={"price"} placeholder={"59.99"} step={"0.01"} type={"number"} />
</div>
</div>
<div>
<label className={"block font-label-md text-label-md text-on-surface-variant mb-1.5"} htmlFor={"discount"}>
                Descuento Promocional (%)
              </label>
<div className={"relative"}>
<input className={"w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface rounded px-3 py-2.5 font-label-md text-label-md placeholder:text-outline outline-none"} id={"discount"} max={"100"} min={"0"} placeholder={"25"} type={"number"} />
<span className={"absolute right-3 top-2.5 font-label-md text-label-md text-on-surface-variant"}>% OFF</span>
</div>
</div>
</div>

<div>
<div className={"flex items-center justify-between mb-1.5"}>
<label className={"font-label-md text-label-md text-on-surface-variant"} htmlFor={"keys-batch"}>
                Carga de Claves en Lote (Batch Serials)
              </label>
<button className={"font-label-sm text-label-sm text-primary-container hover:underline flex items-center gap-1"} type={"button"}>
<span className={"material-symbols-outlined text-[14px]"}>upload_file</span>
<span>Cargar CSV</span>
</button>
</div>
<div className={"relative"}>
<textarea className={"w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface rounded p-3 font-code-key text-code-key text-xs placeholder:text-outline/70 outline-none resize-none"} id={"keys-batch"} placeholder={"Pega los seriales uno por línea:\nNX92-8819-KV01-TR89\nNX92-8820-KV02-TR90\nNX92-8821-KV03-TR91"} rows={"4"} />
</div>
<p className={"font-body-sm text-body-sm text-outline mt-1 flex items-center gap-1"}>
<span className={"material-symbols-outlined text-[13px] text-secondary-container"}>verified</span>
              Encriptación AES-256 aplicada automáticamente al indexar claves.
            </p>
</div>

<div className={"pt-2"}>
<button className={"w-full py-3 bg-primary-container hover:bg-secondary-container text-surface-container-lowest font-label-lg text-label-lg font-bold rounded flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,240,255,0.3)] transition-all duration-150 active:scale-[0.98]"} type={"submit"}>
<span className={"material-symbols-outlined text-[20px]"}>cloud_sync</span>
<span>Guardar e Indexar en Tienda</span>
</button>
</div>
</form>
{statusMessage && <p className="mt-3 font-body-sm text-body-sm text-primary-container" role="status">{statusMessage}</p>}
</section>

<section className={"lg:col-span-7 bg-surface-container-low border border-outline-variant rounded-lg p-space-lg relative shadow-md"}>

<div className={"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-secondary-container via-transparent to-transparent"} />
<div className={"flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-surface-container-highest"}>
<div>
<div className={"flex items-center gap-2"}>
<span className={"material-symbols-outlined text-secondary-container text-[20px]"}>receipt_long</span>
<h2 className={"font-headline-sm text-headline-sm text-on-surface"}>
                Últimas Transacciones en Tiempo Real
              </h2>
</div>
<p className={"font-body-sm text-body-sm text-on-surface-variant mt-0.5"}>
              Eventos de compra confirmados vía Neural Payment Protocol
            </p>
</div>
<div className={"flex items-center gap-2"}>
<span className={"inline-flex items-center px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant"}>
              Auto-refresh: 5s
            </span>
</div>
</div>

<div className={"overflow-x-auto"}>
<table className={"w-full text-left border-collapse"}>
<thead>
<tr className={"border-b border-surface-container-highest font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
<th className={"py-2.5 px-3"}>ID Transacción</th>
<th className={"py-2.5 px-3"}>Videojuego &amp; Plataforma</th>
<th className={"py-2.5 px-3"}>Hora</th>
<th className={"py-2.5 px-3"}>Monto</th>
<th className={"py-2.5 px-3"}>Estado</th>
<th className={"py-2.5 px-3 text-right"}>Acción</th>
</tr>
</thead>
<tbody className={"divide-y divide-surface-container-highest font-body-md text-body-md"}>

<tr className={"hover:bg-surface-container/60 transition-colors group"}>
<td className={"py-3 px-3 font-label-md text-label-md text-primary-container"}>
                  #TX-9021
                </td>
<td className={"py-3 px-3"}>
<div className={"flex items-center gap-2"}>
<div>
<div className={"font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors"}>
                        Cyberpunk 2077
                      </div>
<span className={"inline-block px-1.5 py-0.2 rounded font-label-sm text-[10px] text-primary-container bg-primary-container/10 border border-primary-container/30 uppercase"}>
                        Steam
                      </span>
</div>
</div>
</td>
<td className={"py-3 px-3 font-label-sm text-label-sm text-on-surface-variant"}>
                  14:32:05
                </td>
<td className={"py-3 px-3 font-label-md text-label-md text-on-surface font-semibold"}>
                  $29.99
                </td>
<td className={"py-3 px-3"}>
<span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-secondary-container bg-secondary-container/10 border border-secondary-container/40 font-label-sm text-label-sm"}>
<span className={"w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#34ff8d]"} />
                    COMPLETADO
                  </span>
</td>
<td className={"py-3 px-3 text-right"}>
<button className={"px-2.5 py-1 text-primary-container hover:bg-primary-container/10 border border-primary-container/30 rounded font-label-sm text-label-sm transition-all duration-150 active:scale-[0.98]"}>
                    Ver Clave
                  </button>
</td>
</tr>

<tr className={"hover:bg-surface-container/60 transition-colors group"}>
<td className={"py-3 px-3 font-label-md text-label-md text-primary-container"}>
                  #TX-9020
                </td>
<td className={"py-3 px-3"}>
<div>
<div className={"font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors"}>
                      Elden Ring: Shadow of the Erdtree
                    </div>
<span className={"inline-block px-1.5 py-0.2 rounded font-label-sm text-[10px] text-secondary-fixed-dim bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/30 uppercase"}>
                      Xbox
                    </span>
</div>
</td>
<td className={"py-3 px-3 font-label-sm text-label-sm text-on-surface-variant"}>
                  14:30:19
                </td>
<td className={"py-3 px-3 font-label-md text-label-md text-on-surface font-semibold"}>
                  $39.99
                </td>
<td className={"py-3 px-3"}>
<span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-secondary-container bg-secondary-container/10 border border-secondary-container/40 font-label-sm text-label-sm"}>
<span className={"w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#34ff8d]"} />
                    COMPLETADO
                  </span>
</td>
<td className={"py-3 px-3 text-right"}>
<button className={"px-2.5 py-1 text-primary-container hover:bg-primary-container/10 border border-primary-container/30 rounded font-label-sm text-label-sm transition-all duration-150 active:scale-[0.98]"}>
                    Ver Clave
                  </button>
</td>
</tr>

<tr className={"hover:bg-[#dc2626]/5 transition-colors group bg-[#dc2626]/[0.02]"}><td className={"py-3 px-3 font-label-md text-label-md text-[#ef4444]"}>#TX-9019</td><td className={"py-3 px-3"}><div><div className={"font-headline-sm text-headline-sm text-on-surface group-hover:text-[#ef4444] transition-colors"}>Black Myth: Wukong</div><span className={"inline-block px-1.5 py-0.2 rounded font-label-sm text-[10px] text-[#ef4444] bg-[#dc2626]/10 border border-[#dc2626]/40 uppercase"}>PS5</span></div></td><td className={"py-3 px-3 font-label-sm text-label-sm text-on-surface-variant"}>14:28:44</td><td className={"py-3 px-3 font-label-md text-label-md text-on-surface font-semibold"}>$59.99</td><td className={"py-3 px-3"}><span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[#ef4444] bg-[#dc2626]/15 border border-[#dc2626]/50 font-label-sm text-label-sm"}><span className={"w-1.5 h-1.5 rounded-full bg-[#ef4444]"} />REVISIÓN / CANCELADO</span></td><td className={"py-3 px-3 text-right"}><button className={"px-2.5 py-1 text-[#ef4444] hover:bg-[#dc2626]/20 border border-[#dc2626]/40 rounded font-label-sm text-label-sm transition-all duration-150 active:scale-[0.98]"}>Auditar</button></td></tr>

<tr className={"hover:bg-surface-container/60 transition-colors group"}>
<td className={"py-3 px-3 font-label-md text-label-md text-primary-container"}>
                  #TX-9018
                </td>
<td className={"py-3 px-3"}>
<div>
<div className={"font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors"}>
                      Helldivers 2: Super Citizen Edition
                    </div>
<span className={"inline-block px-1.5 py-0.2 rounded font-label-sm text-[10px] text-primary-container bg-primary-container/10 border border-primary-container/30 uppercase"}>
                      Steam
                    </span>
</div>
</td>
<td className={"py-3 px-3 font-label-sm text-label-sm text-on-surface-variant"}>
                  14:25:01
                </td>
<td className={"py-3 px-3 font-label-md text-label-md text-on-surface font-semibold"}>
                  $49.99
                </td>
<td className={"py-3 px-3"}>
<span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-secondary-container bg-secondary-container/10 border border-secondary-container/40 font-label-sm text-label-sm"}>
<span className={"w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#34ff8d]"} />
                    COMPLETADO
                  </span>
</td>
<td className={"py-3 px-3 text-right"}>
<button className={"px-2.5 py-1 text-primary-container hover:bg-primary-container/10 border border-primary-container/30 rounded font-label-sm text-label-sm transition-all duration-150 active:scale-[0.98]"}>
                    Ver Clave
                  </button>
</td>
</tr>
</tbody>
</table>
</div>

<div className={"mt-space-md p-space-md bg-surface-container-lowest border border-dashed border-[#9333ea]/60 rounded-lg shadow-[0_0_12px_rgba(147,51,234,0.15)]"}><div className={"flex items-center justify-between mb-2"}><span className={"font-label-sm text-label-sm text-[#c084fc] uppercase tracking-wider flex items-center gap-1 font-semibold"}><span className={"material-symbols-outlined text-[14px] text-[#a855f7]"}>lock_open</span>Clave Despachada para Inspección (#TX-9021)</span><span className={"font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#9333ea]/20 border border-[#9333ea]/40 text-[#c084fc]"}>HASH SHA-256</span></div><div className={"flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low p-2.5 rounded border border-[#9333ea]/40"}><div className={"font-code-key text-code-key text-[#c084fc] tracking-widest text-center sm:text-left select-all font-bold"}>CYBR-77PL-9920-NX84-VOID</div><button className={"px-3 py-1 bg-[#9333ea]/20 hover:bg-[#9333ea] hover:text-white text-[#c084fc] font-label-sm text-label-sm rounded border border-[#a855f7]/50 flex items-center gap-1.5 transition-all"}><span className={"material-symbols-outlined text-[14px]"}>content_copy</span><span>Copiar Serial</span></button></div></div>
</section>
</div>
</main>







</div>
  )
}

export default AdminPanel
