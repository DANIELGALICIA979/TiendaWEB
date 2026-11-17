import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import RequestState from '../components/RequestState.jsx'
import { guardarSesion, loginUsuario } from '../services/api.js'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await loginUsuario(form)
      guardarSesion(response)
      navigate('/')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-surface-container-lowest">
      <Navbar active="/login" />
      <main className="cyber-matrix-grid relative flex flex-1 flex-col items-center justify-center overflow-hidden px-space-md py-space-xl">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-700/25 via-crimson/20 to-purple-900/25 blur-[120px]" />
        <section className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-surface-container-low p-space-lg backdrop-blur-xl purple-halo-glow sm:p-space-xl">
          <div className="mb-space-lg text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary-container/30 bg-primary-container/10 px-3 py-1 text-primary-container">
              <span className="material-symbols-outlined text-sm">shield_lock</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Protocolo de Acceso Seguro</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-white sm:font-headline-xl sm:text-headline-xl">
              Acceso a la <span className="text-primary-container">Bóveda</span>
            </h1>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Introduce tus credenciales para sincronizar tu cuenta de Nexus Keys
            </p>
          </div>
          <form className="space-y-space-md" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="identifier">
                Gamertag o Correo Electrónico
              </label>
              <input autoComplete="username" className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none" id="identifier" name="identifier" onChange={handleChange} placeholder="Gamertag o correo electrónico" required type="text" value={form.identifier} />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="password">Contraseña</label>
              <div className="relative">
                <input autoComplete="current-password" className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 pr-12 text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none" id="password" name="password" onChange={handleChange} placeholder="Contraseña" required type={showPassword ? 'text' : 'password'} value={form.password} />
                <button aria-label="Revelar u ocultar contraseña" className="absolute inset-y-0 right-0 px-3 text-outline hover:text-primary-container" onClick={() => setShowPassword(value => !value)} type="button">
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-on-surface-variant">
              <input checked={remember} className="h-4 w-4 accent-cyan-400" onChange={event => setRemember(event.target.checked)} type="checkbox" />
              <span className="font-label-sm text-label-sm">Recordar sesión</span>
            </label>
            <RequestState error={error} />
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-700 to-red-700 px-4 py-3 font-label-lg text-label-lg font-bold uppercase tracking-wider text-white transition hover:brightness-125 disabled:cursor-wait disabled:opacity-60" disabled={loading} type="submit">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">login</span>}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            <Link className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-lowest/80 px-4 py-2.5 font-label-md text-label-md font-semibold uppercase tracking-wider text-purple-200 transition hover:bg-purple-950/40" to="/registro">
              <span className="material-symbols-outlined text-base">person_add</span>
              Crear Cuenta Nueva
            </Link>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Login
