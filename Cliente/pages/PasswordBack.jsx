import { useState } from 'react'

function PasswordBack() {
  const [formMessage, setFormMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setFormMessage('El envío del enlace requiere configurar la autenticación de Supabase.')
  }

  return (
    <div className={"bg-surface-container-lowest text-on-surface font-body-md text-body-md min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-surface-container-lowest cyber-grid relative overflow-x-hidden"}>

<div className={"fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-purple-950/20 via-cyan-950/10 to-transparent blur-3xl pointer-events-none -z-10"} />
<div className={"fixed bottom-0 right-0 w-[400px] h-[350px] bg-red-950/15 blur-3xl pointer-events-none -z-10"} />


<main className={"flex-grow flex items-center justify-center px-space-md py-space-xl relative z-10"}>
<div className={"w-full max-w-lg"}>



<section className={"bg-surface-container border border-[#3b494b]/70 rounded-lg relative overflow-hidden pulse-glow-purple"}>

<div className={"h-1 w-full bg-gradient-to-r from-transparent via-[#a855f7] via-cyan-400 to-transparent"} />
<div className={"absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"} />
<div className={"p-space-lg lg:p-space-xl flex flex-col gap-space-lg"}>

<div className={"flex flex-col items-center text-center"}>

<div className={"relative mb-space-md"}>
<div className={"w-16 h-16 rounded-xl bg-surface-container-lowest border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]"}>
<span className={"material-symbols-outlined text-purple-400 text-3xl"} data-icon={"lock_reset"} data-weight={"fill"}>lock_reset</span>
</div>


</div>



<h1 className={"font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-bold"}>
              Restablecer  contraseña</h1>

<p className={"font-body-md text-body-md text-on-surface-variant max-w-md mt-space-xs text-balance"}>
              Introduce el correo electrónico asociado a tu cuenta. Te enviaremos un enlace para que accedas al formulario de restablecimiento.
            </p>
</div>

<div className={"bg-red-950/30 border border-red-500/40 rounded p-space-sm flex items-start gap-space-sm"}>
<span className={"material-symbols-outlined text-red-500 mt-0.5 flex-shrink-0"} data-icon={"timer"}>timer</span>
<div className={"flex flex-col text-left"}>
<span className={"font-label-md text-label-md text-red-400 font-bold uppercase tracking-wide"}>Ventana de Caducidad Estricta</span>
<span className={"font-body-sm text-body-sm text-red-200/80"}>Los enlaces de recuperación vencen 10 minutos despues de ser enviados.</span>
</div>
</div>

<form className={"flex flex-col gap-space-md"} id={"recovery-form"} onSubmit={handleSubmit}>

<div className={"flex flex-col gap-1.5 text-left"}>
<div className={"flex justify-between items-center"}>
<label className={"font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5"} htmlFor={"recovery-email"}>
<span className={"material-symbols-outlined text-primary-container text-base"} data-icon={"alternate_email"}>alternate_email</span>
                  Correo Electrónico
                </label>
<span className={"font-label-sm text-label-sm text-outline"}>Identificador de cuenta Gamer</span>
</div>
<div className={"relative"}>
<input className={"w-full bg-surface-container-lowest text-on-surface font-code-key text-body-md px-4 py-3 rounded border border-outline-variant/80 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none placeholder:text-outline transition-all duration-200"} id={"recovery-email"} name={"email"} placeholder={"cyber_trader@nexusvault.gg"} required={true} type={"email"} />
<div className={"absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none"}>
<span className={"material-symbols-outlined text-outline"} data-icon={"shield"} id={"email-valid-icon"}>shield</span>
</div>
</div>

</div>

<button className={"w-full mt-2 bg-primary-container text-on-primary-fixed font-headline-sm text-headline-sm font-bold py-3.5 px-space-md rounded shadow-[0_0_14px_rgba(0,240,255,0.4)] hover:bg-secondary-container hover:shadow-[0_0_18px_rgba(52,255,141,0.5)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer"} id={"submit-btn"} type={"submit"}>
<span>Enviar Enlace de Recuperación / Restablecer Acceso</span>
<span className={"material-symbols-outlined group-hover:translate-x-1 transition-transform"} data-icon={"send"}>send</span>
</button>
</form>

{formMessage && <p className="rounded border border-amber-500/40 bg-amber-950/30 p-3 text-amber-200" role="status">{formMessage}</p>}

<div className={"pt-space-sm border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm"}>

<a className={"inline-flex items-center gap-1 text-on-surface-variant hover:text-primary-container font-label-md text-label-md transition-colors duration-150 group"} href={"/login"}>
<span className={"material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform"} data-icon={"arrow_back"}>arrow_back</span>
              Volver a Iniciar Sesión
            </a>


</div>
</div>


</section>

<div className={"mt-space-md grid grid-cols-3 gap-space-sm text-center"}>
<div className={"p-2 bg-surface-container-low/40 rounded border border-outline-variant/30 flex flex-col items-center"}>
<span className={"material-symbols-outlined text-primary-container text-lg mb-1"} data-icon={"speed"}>speed</span>
<span className={"font-label-sm text-label-sm text-on-surface font-semibold"}>Envío Inmediato</span>
<span className={"font-body-sm text-body-sm text-outline text-[11px]"}>&lt; 3.2 segundos</span>
</div>

<div className={"p-2 bg-surface-container-low/40 rounded border border-outline-variant/30 flex flex-col items-center"}>
<span className={"material-symbols-outlined text-secondary-fixed-dim text-lg mb-1"} data-icon={"support_agent"}>support_agent</span>
<span className={"font-label-sm text-label-sm text-on-surface font-semibold"}>Uplink 24/7</span>
<span className={"font-body-sm text-body-sm text-outline text-[11px]"}>Respuesta Prioritaria</span>
</div>
</div>
</div>
</main>





</div>
  )
}

export default PasswordBack
