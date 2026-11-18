import SiteHeader from './SiteHeader.jsx'
import SiteFooter from './SiteFooter.jsx'

function SiteLayout({ children, user, onSignOut }) {
  return (
    <div className="site-layout">
      <SiteHeader user={user} onSignOut={onSignOut} />
      <div className="site-content">{children}</div>
      <SiteFooter />
    </div>
  )
}

export default SiteLayout
