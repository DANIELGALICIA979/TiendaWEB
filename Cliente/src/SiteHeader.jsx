import useCart from './useCart.js'

function SiteHeader({ user, onSignOut }) {
  const username = user?.user_metadata?.username || user?.email
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="site-header">
      <div className="site-header-content">
        <div className="site-brand-group">
          <a className="site-brand" href="/catalogo">
            <span className="site-brand-mark" aria-hidden="true" />
            Nexus Keys
          </a>
          {username && (
            <>
              <span className="site-brand-separator" aria-hidden="true">|</span>
              <span className="site-username" title={username}>{username}</span>
            </>
          )}
        </div>
        <div className="site-account">
          <a className="site-cart-link" href="/carrito" aria-label="Carrito de compras" title="Carrito de compras">
            <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
            {itemCount > 0 && <span className="site-cart-count">{itemCount}</span>}
          </a>
          {user ? (
            <>
              <a
                className="site-icon-button"
                href="/claves"
                aria-label="Mi Bóveda"
                title="Mi Bóveda"
              >
                <span className="material-symbols-outlined" aria-hidden="true">vpn_key</span>
              </a>
              <button
                className="site-icon-button"
                onClick={onSignOut}
                type="button"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined" aria-hidden="true">logout</span>
              </button>
            </>
          ) : (
            <>
              <a className="site-account-button" href="/login">Iniciar sesión</a>
              <a className="site-register-button" href="/registro">Registrarse</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
