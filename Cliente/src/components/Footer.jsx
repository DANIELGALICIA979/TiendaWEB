import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-md px-space-md py-space-lg sm:flex-row sm:items-center sm:justify-between lg:px-space-xl">
        <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-semibold uppercase tracking-widest text-primary-container">
          <span aria-hidden="true" className="material-symbols-outlined">terminal</span>
          Nexus Keys
        </div>
        <p className="font-body-sm text-body-sm text-outline">
          © 2025 Nexus Keys Vault. Entrega digital instantánea y segura.
        </p>
        <Link className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary-container" to="/login">
          Soporte
        </Link>
      </div>
    </footer>
  )
}

export default Footer
