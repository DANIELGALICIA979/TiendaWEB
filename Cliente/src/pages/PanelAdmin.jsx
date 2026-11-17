import { useCallback, useEffect, useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import RequestState from '../components/RequestState.jsx'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerHistorialCompras,
  obtenerProductos,
} from '../services/api.js'

const emptyForm = {
  title: '',
  platform: '',
  category: '',
  price: '',
  imageUrl: '',
  keys: '',
}

function formatPrice(value) {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount)
    : 'No disponible'
}

function PanelAdmin() {
  const [products, setProducts] = useState([])
  const [purchases, setPurchases] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [purchasesLoading, setPurchasesLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  const [purchasesError, setPurchasesError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState(null)
  const [success, setSuccess] = useState(null)

  const loadProducts = useCallback(async () => {
    try {
      const result = await obtenerProductos()
      if (!Array.isArray(result)) throw new Error('La respuesta del catálogo no tiene el formato esperado.')
      setProducts(result)
    } catch (requestError) {
      setProductsError(requestError.message)
    } finally {
      setProductsLoading(false)
    }
  }, [])

  const loadPurchases = useCallback(async () => {
    try {
      const result = await obtenerHistorialCompras()
      if (!Array.isArray(result)) throw new Error('La respuesta de compras no tiene el formato esperado.')
      setPurchases(result)
    } catch (requestError) {
      setPurchasesError(requestError.message)
    } finally {
      setPurchasesLoading(false)
    }
  }, [])

  const reloadProducts = useCallback(() => {
    setProductsLoading(true)
    setProductsError(null)
    return loadProducts()
  }, [loadProducts])

  const reloadPurchases = useCallback(() => {
    setPurchasesLoading(true)
    setPurchasesError(null)
    return loadPurchases()
  }, [loadPurchases])

  useEffect(() => {
    loadProducts()
    loadPurchases()
  }, [loadProducts, loadPurchases])

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSaving(true)
    setFormError(null)
    setSuccess(null)
    const data = {
      title: form.title.trim(),
      platform: form.platform.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
    }
    if (editingId === null || form.keys.trim()) {
      data.keys = form.keys.split(/\r?\n/).map(key => key.trim()).filter(Boolean)
    }

    try {
      if (editingId === null) {
        await crearProducto(data)
        setSuccess('Producto creado correctamente.')
      } else {
        await actualizarProducto(editingId, data)
        setSuccess('Producto actualizado correctamente.')
      }
      resetForm()
      await reloadProducts()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const startEditing = product => {
    setEditingId(product.id)
    setForm({
      title: product.title ?? '',
      platform: product.platform ?? '',
      category: product.category ?? '',
      price: product.price === undefined || product.price === null ? '' : String(product.price),
      imageUrl: product.imageUrl ?? '',
      keys: '',
    })
    setFormError(null)
    setSuccess(null)
  }

  const handleDelete = async id => {
    setDeletingId(id)
    setFormError(null)
    setSuccess(null)
    try {
      await eliminarProducto(id)
      setSuccess('Producto eliminado correctamente.')
      if (editingId === id) resetForm()
      await reloadProducts()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass = 'w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface outline-none focus:border-primary-container'

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <Navbar active="/admin" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-space-xl px-space-md py-space-xl lg:px-space-xl">
        <header>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container">Nexus Keys</p>
          <h1 className="mt-1 font-headline-xl text-headline-xl font-extrabold">Panel de Administración</h1>
          <p className="mt-2 text-on-surface-variant">Gestiona productos y consulta las transacciones.</p>
        </header>

        <section className="grid gap-space-lg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <form className="h-fit space-y-space-md rounded-xl border border-outline-variant bg-surface-container-low p-space-lg" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-space-sm">
              <h2 className="font-headline-md text-headline-md font-semibold">{editingId === null ? 'Crear Producto' : 'Editar Producto'}</h2>
              {editingId !== null && <button className="font-label-sm text-label-sm text-outline hover:text-primary" onClick={resetForm} type="button">Cancelar edición</button>}
            </div>
            <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="title">
              Nombre del videojuego
              <input className={inputClass} id="title" name="title" onChange={handleChange} placeholder="Nombre del videojuego" required value={form.title} />
            </label>
            <div className="grid gap-space-sm sm:grid-cols-2">
              <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="platform">
                Plataforma
                <input className={inputClass} id="platform" name="platform" onChange={handleChange} placeholder="Plataforma" required value={form.platform} />
              </label>
              <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="category">
                Categoría
                <input className={inputClass} id="category" name="category" onChange={handleChange} placeholder="Categoría" value={form.category} />
              </label>
            </div>
            <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="price">
              Precio
              <input className={inputClass} id="price" min="0" name="price" onChange={handleChange} placeholder="0.00" required step="0.01" type="number" value={form.price} />
            </label>
            <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="imageUrl">
              URL de imagen
              <input className={inputClass} id="imageUrl" name="imageUrl" onChange={handleChange} placeholder="https://" type="url" value={form.imageUrl} />
            </label>
            <label className="block space-y-1 font-label-sm text-label-sm text-on-surface-variant" htmlFor="keys">
              Claves de licencia
              <textarea className={`${inputClass} min-h-24`} id="keys" name="keys" onChange={handleChange} placeholder="Ingresa una clave por línea" value={form.keys} />
            </label>
            <RequestState error={formError} />
            {success && <p className="font-body-sm text-body-sm text-secondary-fixed" role="status">{success}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-4 py-3 font-label-md text-label-md font-bold text-surface-container-lowest hover:bg-primary disabled:opacity-60" disabled={saving} type="submit">
              {saving && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
              {saving ? 'Guardando...' : editingId === null ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
          </form>

          <section className="space-y-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold">Productos</h2>
              <RequestState empty={!productsLoading && !productsError && products.length === 0} emptyMessage="No hay productos disponibles." error={productsError} loading={productsLoading} onRetry={reloadProducts} />
            </div>
            {!productsLoading && !productsError && products.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low">
                <table className="w-full min-w-[540px] text-left">
                  <thead className="border-b border-outline-variant bg-surface-container-high">
                    <tr className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      <th className="p-space-sm">Producto</th><th className="p-space-sm">Plataforma</th><th className="p-space-sm">Precio</th><th className="p-space-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    {products.map(product => (
                      <tr className="font-body-sm text-body-sm" key={product.id}>
                        <td className="p-space-sm">{product.title}</td>
                        <td className="p-space-sm text-on-surface-variant">{product.platform}</td>
                        <td className="p-space-sm text-primary-container">{formatPrice(product.price)}</td>
                        <td className="space-x-2 p-space-sm">
                          <button className="font-label-sm text-label-sm text-primary-container hover:underline" onClick={() => startEditing(product)} type="button">Editar</button>
                          <button className="font-label-sm text-label-sm text-error hover:underline disabled:opacity-50" disabled={deletingId === product.id} onClick={() => handleDelete(product.id)} type="button">
                            {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>

        <section className="space-y-space-md">
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold">Transacciones recientes</h2>
            <RequestState empty={!purchasesLoading && !purchasesError && purchases.length === 0} emptyMessage="No hay transacciones disponibles." error={purchasesError} loading={purchasesLoading} onRetry={reloadPurchases} />
          </div>
          {!purchasesLoading && !purchasesError && purchases.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low">
              <table className="w-full min-w-[540px] text-left">
                <thead className="border-b border-outline-variant bg-surface-container-high">
                  <tr className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <th className="p-space-sm">Compra</th><th className="p-space-sm">Usuario</th><th className="p-space-sm">Estado</th><th className="p-space-sm">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {purchases.map(purchase => (
                    <tr className="font-body-sm text-body-sm" key={purchase.id}>
                      <td className="p-space-sm">#{purchase.id}</td>
                      <td className="p-space-sm">{purchase.user?.gamertag || purchase.user?.name || '—'}</td>
                      <td className="p-space-sm text-secondary-fixed">{purchase.status || '—'}</td>
                      <td className="p-space-sm text-primary-container">{formatPrice(purchase.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PanelAdmin
