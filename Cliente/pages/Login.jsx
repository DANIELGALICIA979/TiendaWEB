import { useState } from 'react'
import { guardarSesion, iniciarSesion } from '../services/api.js'

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setFormMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const rememberSession = formData.get('remember') === 'on'

    try {
      const { session } = await iniciarSesion(email, password)
      guardarSesion(session, rememberSession)
      window.location.assign('/catalogo')
    } catch (error) {
      setFormMessage(error.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={"bg-background text-on-surface min-h-screen flex flex-col font-body-md text-body-md selection:bg-primary-container selection:text-surface-container-lowest antialiased overflow-x-hidden"}>






<main className={"flex-1 relative flex flex-col justify-center items-center px-space-md py-space-xl cyber-matrix-grid overflow-hidden"}>

<div className={"pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-r from-purple-700/25 via-crimson/20 to-purple-900/25 blur-[120px] rounded-full"} style={{"background": "radial-gradient(circle, rgba(147, 51, 234, 0.28) 0%, rgba(185, 28, 28, 0.18) 50%, transparent 75%)"}} />
<div className={"pointer-events-none absolute -bottom-32 left-1/3 w-[550px] h-[380px] blur-[130px] rounded-full"} style={{"background": "radial-gradient(circle, rgba(190, 18, 60, 0.25) 0%, rgba(126, 34, 206, 0.25) 60%, transparent 80%)"}} />
<div className={"w-full max-w-md z-10 flex flex-col gap-space-md"} id={"login-anchor"}>

<div className={"w-full bg-surface-container-lowest/95 border border-purple-500/40 backdrop-blur-md rounded-lg p-space-sm flex items-center justify-between shadow-[0_0_16px_rgba(147,51,234,0.18)]"} style={{"borderColor": "rgba(168, 85, 247, 0.35)"}}>
<div className={"flex items-center gap-2"}>
<span className={"relative flex h-2.5 w-2.5"}>
<span className={"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"} style={{"backgroundColor": "#ef4444"}} />
<span className={"relative inline-flex rounded-full h-2.5 w-2.5"} style={{"backgroundColor": "#dc2626"}} />
</span>
<span className={"font-label-sm text-label-sm uppercase tracking-wider text-purple-300 font-bold"} style={{"color": "rgb(216, 180, 254)"}}>
            Servidores Globales: <span style={{"color": "rgb(248, 113, 113)"}}>DEFCON-1 ENCRIPTADO</span>
</span>
</div>
<div className={"flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded"} style={{"background": "rgba(147, 51, 234, 0.15)", "border": "1px solid rgba(168, 85, 247, 0.3)"}}>
<span className={"material-symbols-outlined text-[14px]"} style={{"color": "rgb(192, 132, 252)"}}>bolt</span>
<span className={"font-semibold"} style={{"color": "rgb(244, 63, 94)"}}>12ms</span>
</div>
</div>

<div className={"relative bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl backdrop-blur-xl overflow-hidden purple-halo-glow"} style={{"border": "1px solid transparent", "background": "linear-gradient(rgb(27, 27, 32), rgb(27, 27, 32)) padding-box padding-box, linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(220, 38, 38) 50%, rgb(126, 34, 206) 100%) border-box border-box"}}>

<div className={"absolute top-0 left-0 right-0 h-[2px]"} style={{"background": "linear-gradient(90deg, transparent, #a855f7 30%, #ef4444 60%, transparent)"}} />
<div className={"absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"} style={{"background": "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(220, 38, 38, 0.15) 70%, transparent 100%)"}} />

<div className={"mb-space-lg text-center"}>
<div className={"inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full mb-2"} style={{"background": "rgba(147, 51, 234, 0.15)", "border": "1px solid rgba(168, 85, 247, 0.4)"}}>
<span className={"material-symbols-outlined text-[14px]"} style={{"color": "rgb(192, 132, 252)", "fontVariationSettings": "\"FILL\" 1"}}>shield_lock</span>
<span className={"font-label-sm text-label-sm uppercase tracking-wider font-semibold"} style={{"color": "rgb(233, 213, 255)"}}>Protocolo de Acceso Seguro</span>
<span className={"h-1.5 w-1.5 rounded-full ml-1"} style={{"backgroundColor": "#ef4444"}} />
</div>
<h1 className={"font-headline-lg text-headline-lg sm:font-headline-xl sm:text-headline-xl tracking-tight text-white"}>
            Acceso a la <span style={{"background": "linear-gradient(135deg, rgb(216, 180, 254) 0%, rgb(252, 165, 165) 100%) text", "WebkitTextFillColor": "transparent"}}>Bóveda</span>
</h1>
<p className={"font-body-sm text-body-sm text-on-surface-variant mt-1"}>
            Introduce tus credenciales para sincronizar tu cuenta de Nexus Keys
          </p>
</div>

<form className={"space-y-space-md"} onSubmit={handleSubmit}>

<div className={"space-y-1.5 text-left"}>
<div className={"flex justify-between items-center"}>
<label className={"font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1"} htmlFor={"identifier"}>
<span className={"material-symbols-outlined text-[13px]"} style={{"color": "rgb(192, 132, 252)"}}>badge</span>
                Correo Electrónico
              </label>
<span className={"font-label-sm text-label-sm font-bold px-1.5 py-0.2 rounded"} style={{"color": "rgb(252, 165, 165)", "background": "rgba(185, 28, 28, 0.25)", "border": "1px solid rgba(239, 68, 68, 0.4)"}}>REQ</span>
</div>
<div className={"relative"}>
<div className={"absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline"}>
<span className={"material-symbols-outlined text-[18px]"} style={{"color": "rgb(168, 85, 247)"}}>alternate_email</span>
</div>
<input autoComplete={"email"} className={"w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-lowest border text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none transition-all"} id={"identifier"} name={"email"} placeholder={"tucorreo@ejemplo.com"} required={true} type={"email"} style={{"borderColor": "rgba(168, 85, 247, 0.35)", "boxShadow": "inset 0 1px 3px rgba(0,0,0,0.5)"}} />
</div>
</div>

<div className={"space-y-1.5 text-left"}>
<div className={"flex justify-between items-center"}>
<label className={"font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1"} htmlFor={"password"}>
<span className={"material-symbols-outlined text-[13px]"} style={{"color": "rgb(192, 132, 252)"}}>lock</span>
                Contraseña
              </label>
<span className={"font-label-sm text-label-sm font-bold px-1.5 py-0.2 rounded flex items-center gap-1"} style={{"color": "rgb(248, 113, 113)", "background": "rgba(185, 28, 28, 0.2)", "border": "1px solid rgba(220, 38, 38, 0.35)"}}>
<span className={"w-1.5 h-1.5 rounded-full"} style={{"backgroundColor": "#ef4444"}} /> ENCRYPTED
              </span>
</div>
<div className={"relative"}>
<div className={"absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline"}>
<span className={"material-symbols-outlined text-[18px]"} style={{"color": "rgb(168, 85, 247)"}}>key</span>
</div>
<input autoComplete={"current-password"} className={"w-full pl-10 pr-11 py-2.5 rounded-lg bg-surface-container-lowest border text-on-surface font-code-key text-code-key placeholder:text-outline focus:outline-none tracking-wider transition-all"} id={"password"} name={"password"} placeholder={"••••••••••••••••"} required={true} type={passwordVisible ? 'text' : 'password'} style={{"borderColor": "rgba(168, 85, 247, 0.35)", "boxShadow": "inset 0 1px 3px rgba(0,0,0,0.5)"}} />
<button aria-label={"Revelar u ocultar contraseña"} className={"absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline transition-colors focus:outline-none"} id={"toggle-password"} type={"button"} onClick={() => setPasswordVisible((visible) => !visible)} style={{"color": "rgb(168, 85, 247)"}}>
<span className={"material-symbols-outlined text-[18px]"} id={"password-toggle-icon"}>{passwordVisible ? 'visibility_off' : 'visibility'}</span>
</button>
</div>
</div>
{formMessage && <p className="text-red-400 text-sm" role="status">{formMessage}</p>}

<div className={"flex items-center justify-between pt-1"}>
<label className={"flex items-center gap-2 cursor-pointer select-none group"}>
<input className={"w-4 h-4 rounded-DEFAULT bg-surface-container-lowest focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"} id={"remember"} name={"remember"} type={"checkbox"} style={{"accentColor": "#9333ea", "borderColor": "rgba(168, 85, 247, 0.5)"}} />
<span className={"font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors"}>
                Recordar sesión
              </span>
</label>
<a className={"font-label-sm text-label-sm transition-all hover:underline"} href={"/recuperar"} style={{"color": "rgb(192, 132, 252)"}}>
              ¿Olvidaste tu contraseña?
            </a>
</div>

<div className={"pt-2 space-y-space-sm"}>

<button aria-busy={isSubmitting} className={"w-full py-3 px-4 rounded-lg text-white font-label-lg text-label-lg uppercase tracking-wider flex items-center justify-center gap-2 btn-purple-crimson active:scale-[0.98] transition-all duration-150 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-wait"} disabled={isSubmitting} type={"submit"}>
<span className={"material-symbols-outlined text-[18px]"} style={{"fontVariationSettings": "\"FILL\" 1"}}>login</span>
              {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
            </button>

<a className={"w-full py-2.5 px-4 rounded-lg bg-surface-container-lowest/80 text-purple-200 font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 text-center hover:bg-purple-950/40 font-semibold"} href={"/registro"} style={{"border": "1px solid rgba(168, 85, 247, 0.45)", "color": "rgb(233, 213, 255)"}}>
<span className={"material-symbols-outlined text-[16px]"} style={{"color": "rgb(248, 113, 113)"}}>person_add</span>
              Crear Cuenta Nueva
            </a>
</div>
</form>




</div>
</div>
</main>













</div>
  )
}

export default Login
