function SiteLayout({ children, user, onSignOut }) {
  const username = user?.user_metadata?.username || user?.email

  return (
    <div className="site-layout">
      <header className="site-header">
        <div className="site-header-content">
          <a className="site-brand" href="/catalogo">
            <span className="site-brand-mark" aria-hidden="true" />
            Nexus Keys
          </a>
          <div className="site-account">
            <a className="site-cart-link" href="/carrito" aria-label="Carrito de compras">
              <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
            </a>
            {user ? (
              <>
                <a className="site-account-button" href="/claves">Mi Bóveda</a>
                <span className="site-username" title={username}>{username}</span>
                <button className="site-account-button" onClick={onSignOut} type="button">
                  Cerrar sesión
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
      <div className="site-content">{children}</div>
      <footer className="site-footer">
        <a className="site-footer-brand" href="/catalogo">Nexus Keys</a>
        <span>© 2026 Nexus Keys</span>
      </footer>
    </div>
  )
}

export default SiteLayout
