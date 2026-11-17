function RequestState({ loading = false, error = null, empty = false, emptyMessage = '', onRetry }) {
  if (loading) {
    return (
      <div aria-live="polite" className="flex items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-space-lg text-primary-container">
        <span aria-hidden="true" className="material-symbols-outlined animate-spin">progress_activity</span>
        <span className="font-label-md text-label-md">Cargando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div aria-live="assertive" className="rounded-xl border border-error/50 bg-error-container/20 p-space-lg text-center">
        <p className="font-body-md text-body-md text-error">{error}</p>
        {onRetry && (
          <button className="mt-3 rounded border border-error/60 px-4 py-2 font-label-md text-label-md text-error hover:bg-error-container/30" onClick={onRetry} type="button">
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-space-xl text-center">
        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-outline">inventory_2</span>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{emptyMessage}</p>
      </div>
    )
  }

  return null
}

export default RequestState
