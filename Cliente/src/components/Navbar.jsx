import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cerrarSesion } from '../services/api.js'
import { useCart } from './useCart.js'

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/historial', label: 'Historial' },
  { to: '/admin', label: 'Administración' },
]

function Navbar({ active }) {
  const { itemCount } = useCart()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem('nexus-user')
        setUser(storedUser ? JSON.parse(storedUser) : null)
      } catch (error) {
        console.error('No se pudo leer la sesión guardada.', error)
        setUser(null)
      }
    }

    updateUser()
    window.addEventListener('nexus-auth-change', updateUser)
    return () => window.removeEventListener('nexus-auth-change', updateUser)
  }, [])

  const userLabel = user?.gamertag || user?.name || user?.nombre || 'Mi cuenta'

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface-container-lowest shadow-[0_0_16px_rgba(0,240,255,0.12)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-space-md px-space-md py-space-sm lg:px-space-xl">
        <Link className="flex shrink-0 items-center gap-space-xs font-headline-md text-headline-md font-semibold uppercase tracking-wider text-primary-container" to="/">
          <span aria-hidden="true" className="material-symbols-outlined">terminal</span>
          Nexus Keys
        </Link>
        <nav aria-label="Navegación principal" className="hidden items-center gap-space-lg md:flex">
          {links.map(({ to, label }) => (
            <Link
              aria-current={active === to ? 'page' : undefined}
              className={`font-label-md text-label-md transition-colors hover:text-primary-container ${active === to ? 'text-primary-container' : 'text-on-surface-variant'}`}
              key={to}
              to={to}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-space-sm">
          <Link aria-label={`Ir al carrito (${itemCount} productos)`} className="relative rounded-lg border border-outline-variant p-2 text-primary-container hover:border-primary-container" to="/carrito">
            <span aria-hidden="true" className="material-symbols-outlined">shopping_cart</span>
            {itemCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-primary-container px-1.5 font-label-sm text-label-sm font-bold text-surface-container-lowest">{itemCount}</span>}
          </Link>
          {user
            ? (
              <>
                <span className="hidden font-label-sm text-label-sm text-on-surface-variant sm:inline">{userLabel}</span>
                <button className="rounded-lg border border-outline-variant px-3 py-1.5 font-label-md text-label-md text-on-surface-variant hover:border-primary-container hover:text-primary" onClick={cerrarSesion} type="button">
                  Cerrar sesión
                </button>
              </>
            )
            : (
              <>
                <Link className="hidden rounded-lg border border-outline-variant px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary sm:inline-flex" to="/login">
                  Iniciar Sesión
                </Link>
                <Link className="rounded-lg bg-primary-container px-3 py-1.5 font-label-md text-label-md font-bold text-surface-container-lowest transition-colors hover:bg-primary-fixed-dim" to="/registro">
                  Registrarse
                </Link>
              </>
            )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
