function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div className="site-footer-main">
          <div className="site-footer-summary">
            <a className="site-footer-brand" href="/catalogo">
              <span className="site-brand-mark" aria-hidden="true" />
              Nexus Keys
            </a>
            <p>
              Tu bóveda de claves digitales para videojuegos, con entrega segura y acceso a tus licencias desde cualquier momento.
            </p>
          </div>
          <nav className="site-footer-links" aria-label="Enlaces del sitio">
            <a href="/catalogo-completo">Catálogo</a>
            <a href="/claves">Mi bóveda</a>
            <a href="/carrito">Carrito</a>
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>© 2026 Nexus Keys. Todos los derechos reservados.</span>
          <span>Pagos y licencias con conexión segura.</span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
