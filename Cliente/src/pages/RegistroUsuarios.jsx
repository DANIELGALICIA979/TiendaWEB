import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import RequestState from '../components/RequestState.jsx'
import { guardarSesion, registrarUsuario } from '../services/api.js'

const initialForm = { gamertag: '', email: '', password: '', confirmPassword: '' }

function RegistroUsuarios() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    try {
      const userData = {
        gamertag: form.gamertag,
        email: form.email,
        password: form.password,
      }
      const response = await registrarUsuario(userData)
      guardarSesion(response)
      setSuccess(true)
      setForm(initialForm)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded border border-outline-variant/60 bg-surface-container-lowest px-3.5 py-2.5 text-on-surface placeholder:text-outline outline-none transition focus:border-primary-container focus:ring-1 focus:ring-primary-container'

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface-container-lowest font-body-md text-body-md text-on-background antialiased selection:bg-primary-container selection:text-surface-container-lowest">
      <Navbar active="/registro" />
      <main className="relative z-10 flex flex-1 items-center justify-center px-space-md py-space-xl">
        <section className="neon-card-glow relative mx-auto w-full max-w-xl rounded-xl border border-purple-500/30 bg-surface p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <span className="rounded-full border border-purple-500/50 bg-purple-950/70 px-2.5 py-1 font-label-sm text-label-sm uppercase tracking-wider text-purple-300">NUEVA IDENTIDAD</span>
            <span className="rounded-full border border-error/60 bg-error-container/30 px-2.5 py-1 font-label-sm text-label-sm uppercase tracking-wider text-error">ENCRIPTACIÓN ACTIVA</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-primary">Registro de usuario</h1>
          <p className="mb-6 mt-1 text-on-surface-variant">
            Crea tu nodo de usuario en Nexus Keys. Ingresa tus credenciales para acceder a la red y gestionar tus licencias.
          </p>
          <form className="space-y-space-md" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="gamertag">Nombre de Usuario / Gamertag</label>
              <input autoComplete="username" className={inputClass} id="gamertag" name="gamertag" onChange={handleChange} placeholder="Nombre de usuario" required type="text" value={form.gamertag} />
              <p className="font-body-sm text-body-sm text-on-surface-variant/70">Este será tu alias público en las transacciones y rankings.</p>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Correo Electrónico</label>
              <input autoComplete="email" className={inputClass} id="email" name="email" onChange={handleChange} placeholder="Correo electrónico" required type="email" value={form.email} />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Contraseña</label>
              <input autoComplete="new-password" className={inputClass} id="password" minLength={8} name="password" onChange={handleChange} placeholder="Mínimo 8 caracteres" required type="password" value={form.password} />
              <p className="font-body-sm text-body-sm text-on-surface-variant/70">Usa al menos 8 caracteres combinando letras y números.</p>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input autoComplete="new-password" className={inputClass} id="confirmPassword" name="confirmPassword" onChange={handleChange} placeholder="Repite tu contraseña" required type="password" value={form.confirmPassword} />
            </div>
            <RequestState error={error} />
            {success && <p className="rounded border border-secondary-fixed bg-[#0a2318] p-4 text-secondary-fixed" role="status">Registro completado correctamente.</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-4 py-3 font-headline-sm text-headline-sm font-bold text-surface-container-lowest transition hover:bg-primary-fixed disabled:cursor-wait disabled:opacity-60" disabled={loading} type="submit">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">bolt</span>}
              <span>{loading ? 'Enviando...' : 'Crear Cuenta / Registrarse'}</span>
            </button>
          </form>
          <div className="mt-6 border-t border-outline-variant/30 pt-5 text-center font-body-sm text-body-sm">
            <span className="text-on-surface-variant">¿Ya tienes cuenta? </span>
            <Link className="font-label-md text-label-md font-semibold text-primary-container hover:underline" to="/login">Iniciar Sesión</Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 font-label-sm text-label-sm text-outline">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-secondary-fixed">speed</span>Activación Automática</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-purple-400">verified</span>Distribuidores Oficiales</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default RegistroUsuarios
