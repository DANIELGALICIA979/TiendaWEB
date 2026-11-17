import { useCallback, useEffect, useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import RequestState from '../components/RequestState.jsx'
import { obtenerHistorialCompras } from '../services/api.js'

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-MX').format(date)
}

function formatPrice(value) {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount)
    : 'No disponible'
}

function HistorialCompras() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [copyError, setCopyError] = useState(null)

  const loadPurchases = useCallback(async () => {
    try {
      const result = await obtenerHistorialCompras()
      if (!Array.isArray(result)) throw new Error('La respuesta del historial no tiene el formato esperado.')
      setPurchases(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPurchases()
  }, [loadPurchases])

  const retryPurchases = () => {
    setLoading(true)
    setError(null)
    loadPurchases()
  }

  const copyKey = async key => {
    try {
      await navigator.clipboard.writeText(key)
      setCopyError(null)
    } catch (clipboardError) {
      setCopyError(`No se pudo copiar la clave: ${clipboardError.message}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <Navbar active="/historial" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-space-lg px-space-md py-space-xl lg:px-space-xl">
        <header>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Cuenta</p>
          <h1 className="mt-1 font-headline-xl text-headline-xl font-extrabold">Historial de Compras</h1>
          <p className="mt-2 text-on-surface-variant">Consulta tus compras y licencias digitales.</p>
        </header>
        <RequestState empty={!loading && !error && purchases.length === 0} emptyMessage="Aún no tienes compras registradas." error={error} loading={loading} onRetry={retryPurchases} />
        {copyError && <RequestState error={copyError} />}
        {!loading && !error && purchases.length > 0 && (
          <section aria-label="Compras registradas" className="space-y-space-md">
            {purchases.map(purchase => (
              <article className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low" key={purchase.id}>
                <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/60 p-space-md">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm">Compra #{purchase.id}</h2>
                    <p className="mt-1 font-body-sm text-body-sm text-outline">{formatDate(purchase.date)}</p>
                  </div>
                  <div className="text-right">
                    {purchase.status && <p className="font-label-sm text-label-sm text-secondary-fixed">{purchase.status}</p>}
                    <p className="mt-1 font-headline-md text-headline-md font-bold text-primary-container">{formatPrice(purchase.total)}</p>
                  </div>
                </div>
                <div className="divide-y divide-outline-variant/50">
                  {(Array.isArray(purchase.items) ? purchase.items : []).map((item, index) => {
                    const itemId = item.id ?? `${purchase.id}-${index}`
                    const key = item.licenseKey || item.key
                    const isVisible = Boolean(visibleKeys[itemId])
                    return (
                      <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-md" key={itemId}>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm">{item.productTitle || item.title || 'Producto'}</h3>
                          {item.platform && <p className="mt-1 font-label-sm text-label-sm text-outline">{item.platform}</p>}
                        </div>
                        {key && (
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-surface-container-lowest px-3 py-2 font-code-key text-code-key text-primary-container">{isVisible ? key : '••••••••••••'}</code>
                            <button aria-label={isVisible ? 'Ocultar clave' : 'Mostrar clave'} className="rounded border border-outline-variant p-2 text-on-surface-variant hover:border-primary-container" onClick={() => setVisibleKeys(current => ({ ...current, [itemId]: !current[itemId] }))} type="button">
                              <span className="material-symbols-outlined">{isVisible ? 'visibility_off' : 'visibility'}</span>
                            </button>
                            <button aria-label="Copiar clave" className="rounded border border-outline-variant p-2 text-on-surface-variant hover:border-primary-container" onClick={() => copyKey(key)} type="button">
                              <span className="material-symbols-outlined">content_copy</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HistorialCompras
