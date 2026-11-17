import { useState } from 'react'
import { guardarSesion, registrarUsuario } from '../services/api.js'

function Register() {
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setFormMessage('')

    const formData = new FormData(event.currentTarget)
    const usernameValue = formData.get('gamertag')
    const emailValue = formData.get('email')
    const passwordValue = formData.get('password')
    const confirmPassword = formData.get('confirm-password')
    const username = typeof usernameValue === 'string' ? usernameValue.trim() : ''
    const email = typeof emailValue === 'string' ? emailValue.trim() : ''
    const password = typeof passwordValue === 'string' ? passwordValue : ''

    if (password !== confirmPassword) {
      setFormMessage('Las contraseñas no coinciden.')
      return
    }

    if (!username || username.length > 40 || password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
      setFormMessage('El gamertag debe tener hasta 40 caracteres y la contraseña al menos 8, con letras y números.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await registrarUsuario(username, email, password)

      if (result.session) {
        guardarSesion(result.session)
        window.location.assign('/catalogo')
        return
      }

      setFormMessage('Si la cuenta pudo crearse, recibirás un correo para confirmar tu dirección.')
    } catch (error) {
      setFormMessage(error.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={"bg-surface-container-lowest text-on-background min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary-container selection:text-surface-container-lowest cyber-grid relative overflow-x-hidden"}>

<div className={"pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-primary-container/10 via-purple-600/10 to-transparent blur-3xl opacity-70"} />
<div className={"pointer-events-none fixed -bottom-32 right-[-10%] w-[500px] h-[400px] bg-purple-700/10 blur-[100px]"} />


<main className={"flex-1 flex items-center justify-center py-space-xl px-space-md sm:px-space-lg relative z-10"}>
<div className={"w-full max-w-xl mx-auto"}>

<div className={"bg-surface border border-purple-500/30 rounded-xl relative p-6 sm:p-8 neon-card-glow backdrop-blur-xl"}>

<div className={"absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container via-purple-500 to-transparent"} />
<div className={"absolute -bottom-[1px] left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-secondary-fixed to-transparent opacity-60"} />

<div className={"flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-6"}>
<div className={"flex items-center gap-2"}>
<span className={"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/50 font-label-sm text-label-sm uppercase tracking-wider"}>
<span className={"w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"} />
              NUEVA IDENTIDAD
            </span>
<span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3d0d0f] text-[#ef4444] border border-[#ef4444]/60 font-label-sm text-label-sm uppercase tracking-wider"}>
<span className={"material-symbols-outlined text-[13px] text-[#ef4444]"} style={{"fontVariationSettings": "\"FILL\" 1"}}>shield_locked</span>
              ENCRIPTACIÓN ACTIVA
            </span>
</div>

</div>

<div className={"mb-6"}>
<h1 className={"font-headline-lg-mobile sm:font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight font-extrabold flex items-center gap-2"}>
            Registro de usuario</h1>
<p className={"font-body-md text-body-md text-on-surface-variant mt-1"}>Crea tu nodo de usuario en Nexus Keys. Ingresa tus credenciales para acceder a la red y gestionar tus licencias.</p>
</div>

<form className={"space-y-space-md"} onSubmit={handleSubmit}>

<div className={"space-y-1.5"}>
<label className={"flex items-center justify-between font-label-md text-label-md text-on-surface"} htmlFor={"gamertag"}>
<span className={"flex items-center gap-1.5"}>
<span className={"material-symbols-outlined text-primary-container text-[16px]"}>sports_esports</span>
                Nombre de Usuario / Gamertag
              </span>
<span className={"text-on-surface-variant/60 font-label-sm text-label-sm"}>Requerido</span>
</label>
<div className={"relative group"}>
<input className={"w-full bg-surface-container-lowest border border-outline-variant/60 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline font-label-md text-label-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-200 outline-none"} id={"gamertag"} maxLength={40} name={"gamertag"} placeholder={"ej. CyberRonin_X"} required={true} type={"text"} />
<div className={"absolute right-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors"}>
<span className={"material-symbols-outlined text-[18px]"}>badge</span>
</div>
</div>
<p className={"font-body-sm text-body-sm text-on-surface-variant/70"}>Este será tu alias público en las transacciones y rankings.</p>
</div>

<div className={"space-y-1.5"}>
<label className={"flex items-center justify-between font-label-md text-label-md text-on-surface"} htmlFor={"email"}>
<span className={"flex items-center gap-1.5"}>
<span className={"material-symbols-outlined text-primary-container text-[16px]"}>alternate_email</span>
                Correo Electrónico
              </span>

</label>
<div className={"relative group"}>
<input className={"w-full bg-surface-container-lowest border border-outline-variant/60 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline font-label-md text-label-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-200 outline-none"} id={"email"} name={"email"} placeholder={"operador@redneural.gg"} required={true} type={"email"} />
<div className={"absolute right-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors"}>
<span className={"material-symbols-outlined text-[18px]"}>verified_user</span>
</div>
</div>
</div><div className={"space-y-1.5"}><label className={"flex items-center justify-between font-label-md text-label-md text-on-surface"} htmlFor={"password"}><span className={"flex items-center gap-1.5"}><span className={"material-symbols-outlined text-primary-container text-[16px]"}>lock</span>Contraseña</span><span className={"text-on-surface-variant/60 font-label-sm text-label-sm"}>Requerido</span></label><div className={"relative group"}><input className={"w-full bg-surface-container-lowest border border-outline-variant/60 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline font-label-md text-label-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-200 outline-none"} id={"password"} minLength={8} name={"password"} placeholder={"Mínimo 8 caracteres, números y símbolos"} required={true} type={"password"} /><div className={"absolute right-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors"}><span className={"material-symbols-outlined text-[18px]"}>key</span></div></div><p className={"font-body-sm text-body-sm text-on-surface-variant/70"}>Usa al menos 8 caracteres combinando letras y números.</p></div><div className={"space-y-1.5"}><label className={"flex items-center justify-between font-label-md text-label-md text-on-surface"} htmlFor={"confirm-password"}><span className={"flex items-center gap-1.5"}><span className={"material-symbols-outlined text-primary-container text-[16px]"}>lock_reset</span>Confirmar Contraseña</span><span className={"text-on-surface-variant/60 font-label-sm text-label-sm"}>Requerido</span></label><div className={"relative group"}><input className={"w-full bg-surface-container-lowest border border-outline-variant/60 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline font-label-md text-label-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-200 outline-none"} id={"confirm-password"} minLength={8} name={"confirm-password"} placeholder={"Repite tu contraseña"} required={true} type={"password"} /><div className={"absolute right-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors"}><span className={"material-symbols-outlined text-[18px]"}>verified</span></div></div></div>



<button aria-busy={isSubmitting} className={"w-full mt-2 py-3 px-4 rounded bg-primary-container text-surface-container-lowest font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 neon-pulse-cyan hover:bg-[#7df4ff] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-wait"} disabled={isSubmitting} type={"submit"}>
<span className={"material-symbols-outlined text-[20px]"} style={{"fontVariationSettings": "\"FILL\" 1"}}>bolt</span>
<span>{isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta / Registrarse'}</span>
</button>
</form>

{formMessage && <p className="mt-4 text-amber-300" role="status">{formMessage}</p>}




<div className={"mt-6 pt-5 border-t border-outline-variant/30 text-center font-body-sm text-body-sm"}>
<span className={"text-on-surface-variant"}>¿Ya tienes cuenta? </span>
<a className={"font-label-md text-label-md text-primary-container font-semibold hover:underline inline-flex items-center gap-1 group"} href={"/login"}>
<span>Iniciar Sesión</span>
<span className={"material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform"}>arrow_forward</span>
</a>
</div>
</div>

<div className={"mt-6 flex flex-wrap items-center justify-center gap-4 text-outline font-label-sm text-label-sm"}>


<span className={"flex items-center gap-1"}>
<span className={"material-symbols-outlined text-[15px] text-secondary-fixed"}>speed</span>
          Activación Automática
        </span>
<span className={"text-outline-variant"}>•</span>
<span className={"flex items-center gap-1"}>
<span className={"material-symbols-outlined text-[15px] text-purple-400"}>verified</span>
          Distribuidores Oficiales
        </span>
</div>
</div>
</main>



</div>
  )
}

export default Register
