import { useCallback, useEffect, useState } from 'react'
import {
  guardarSesion,
  limpiarSesion,
  leerSesion,
  renovarSesion,
  verificarServidor,
} from '../services/api.js'
import AdminPanel from '../pages/AdminPanel.jsx'
import Catalogo from '../pages/HomePage.jsx'
import CatalogoCompleto from '../pages/GameCatalog.jsx'
import DetalleJuego from '../pages/DetalleJuego.jsx'
import Keys from '../pages/Keys.jsx'
import Login from '../pages/Login.jsx'
import PasswordBack from '../pages/PasswordBack.jsx'
import PedidoConfirmacion from '../pages/PedidoConfirmacion.jsx'
import Register from '../pages/Register.jsx'
import ShoppingCart from '../pages/ShoppingCart.jsx'
import SiteLayout from './SiteLayout.jsx'
import './App.css'

const routes = {
  '/': Catalogo,
  '/catalogo': Catalogo,
  '/catalogo-completo': CatalogoCompleto,
  '/detalle-juego': DetalleJuego,
  '/pedido-confirmacion': PedidoConfirmacion,
  '/carrito': ShoppingCart,
  '/login': Login,
  '/registro': Register,
  '/recuperar': PasswordBack,
  '/claves': Keys,
  '/admin': AdminPanel,
}

const publicRoutes = new Set(['/login', '/registro', '/recuperar'])

function handlePageButtonClick(event) {
  const button = event.target instanceof Element
    ? event.target.closest('button')
    : null
  if (!button || button.closest('form')) {
    return
  }

  const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`
    .trim()
    .toLowerCase()

  if (/shopping cart|carrito|añadir al carrito|comprar|bóveda/.test(label)) {
    window.location.assign('/carrito')
  } else if (/ver ficha/.test(label)) {
    window.location.assign('/detalle-juego')
  } else if (/^iniciar sesión$/.test(label)) {
    window.location.assign('/login')
  } else if (/registrarse|crear cuenta/.test(label)) {
    window.location.assign('/registro')
  } else if (/ver clave/.test(label)) {
    window.location.assign('/claves')
  }
}

function App() {
  const [session, setSession] = useState(() => leerSesion())
  const [sessionStatus, setSessionStatus] = useState(() => (
    session ? 'checking' : 'ready'
  ))
  const [backend, setBackend] = useState({
    status: 'checking',
    message: '',
  })

  const consultarBackend = useCallback(async () => {
    try {
      const resultado = await verificarServidor()
      return { status: 'online', message: resultado.message }
    } catch (error) {
      return { status: 'offline', message: error.message }
    }
  }, [])

  useEffect(() => {
    let activo = true

    async function comprobarConexion() {
      const resultado = await consultarBackend()
      if (activo) {
        setBackend(resultado)
      }
    }

    comprobarConexion()
    return () => {
      activo = false
    }
  }, [consultarBackend])

  useEffect(() => {
    let active = true

    async function refreshSessionIfNeeded(currentSession) {
      if (!currentSession?.refresh_token) {
        return null
      }

      const expiresAt = currentSession.expires_at ? currentSession.expires_at * 1000 : 0
      if (expiresAt - Date.now() > 60_000) {
        return currentSession
      }

      try {
        const refreshedSession = await renovarSesion(currentSession.refresh_token)
        const rememberSession = window.localStorage.getItem('nexus.auth.session') !== null
        guardarSesion(refreshedSession, rememberSession)
        return refreshedSession
      } catch (error) {
        if (error.status === 401) {
          limpiarSesion()
          return null
        }
        return currentSession
      }
    }

    async function initializeSession() {
      const restoredSession = await refreshSessionIfNeeded(leerSesion())
      if (active) {
        setSession(restoredSession)
        setSessionStatus('ready')
      }
    }

    initializeSession()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!session?.refresh_token || !session.expires_at) {
      return undefined
    }

    let active = true
    const refreshDelay = Math.max(session.expires_at * 1000 - Date.now() - 60_000, 30_000)
    const timeoutId = window.setTimeout(async () => {
      try {
        const refreshedSession = await renovarSesion(session.refresh_token)
        if (active) {
          const rememberSession = window.localStorage.getItem('nexus.auth.session') !== null
          guardarSesion(refreshedSession, rememberSession)
          setSession(refreshedSession)
        }
      } catch (error) {
        if (error.status === 401) {
          limpiarSesion()
          if (active) {
            setSession(null)
          }
        }
      }
    }, refreshDelay)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [session])

  useEffect(() => {
    function syncSession(event) {
      if (event.key === 'nexus.auth.session') {
        setSession(leerSesion())
      }
    }

    window.addEventListener('storage', syncSession)
    return () => window.removeEventListener('storage', syncSession)
  }, [])

  function cerrarSesion() {
    limpiarSesion()
    setSession(null)
    window.location.assign('/login')
  }

  async function reintentarConexion() {
    setBackend({ status: 'checking', message: '' })
    setBackend(await consultarBackend())
  }

  const pathname = window.location.pathname
  const Page = routes[pathname]
    || (pathname.startsWith('/juego/') ? DetalleJuego : undefined)
  const publicPage = publicRoutes.has(pathname)

  useEffect(() => {
    if (sessionStatus !== 'ready') {
      return
    }

    if (!session && !publicPage) {
      window.location.replace('/login')
    } else if (session && (pathname === '/' || pathname === '/login')) {
      window.location.replace('/catalogo')
    }
  }, [pathname, publicPage, session, sessionStatus])

  if (sessionStatus === 'checking') {
    return (
      <main className="backend-gate" aria-live="polite">
        <h1>Verificando sesión...</h1>
      </main>
    )
  }

  if (!session) {
    const PublicPage = pathname === '/registro' || pathname === '/recuperar'
      ? Page
      : Login
    return <PublicPage />
  }

  if (publicPage) {
    return <Page />
  }

  if (pathname === '/' || pathname === '/login') {
    return (
      <main className="backend-gate" aria-live="polite">
        <h1>Redirigiendo al catálogo...</h1>
      </main>
    )
  }

  if (backend.status === 'online') {
    const PageToRender = Page || Catalogo
    const pageHasOwnChrome = PageToRender === Catalogo || PageToRender === CatalogoCompleto

    if (pageHasOwnChrome) {
      return (
        <div onClick={handlePageButtonClick}>
          <PageToRender user={session.user} onSignOut={cerrarSesion} />
        </div>
      )
    }

    return (
      <div onClick={handlePageButtonClick}>
        <SiteLayout user={session.user} onSignOut={cerrarSesion}>
          <PageToRender user={session.user} onSignOut={cerrarSesion} />
        </SiteLayout>
      </div>
    )
  }

  return (
    <main className="backend-gate" aria-live="polite">
      {backend.status === 'checking' ? (
        <>
          <h1>Conectando con el servidor...</h1>
          <p>Espera mientras verificamos que el backend esté disponible.</p>
        </>
      ) : (
        <>
          <h1>Backend no disponible</h1>
          <p>{backend.message}</p>
          <p>Inicia el servidor e intenta conectarte de nuevo.</p>
          <button
            type="button"
            className="button button-primary"
            onClick={reintentarConexion}
          >
            Reintentar conexión
          </button>
        </>
      )}
    </main>
  )
}

export default App
