const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('nexus-token')
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const responseText = response.status === 204 ? '' : await response.text()
  let result = null

  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = responseText
    }
  }

  if (!response.ok) {
    const message = typeof result === 'object' && result !== null
      ? result.message || result.error
      : result
    throw new Error(typeof message === 'string' && message.trim()
      ? message
      : `La solicitud falló (${response.status}).`)
  }

  return result
}

function toQueryString(filters = {}) {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) query.set(key, value.join(','))
      return
    }
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

export function loginUsuario(credenciales) {
  return request('/auth/login', { method: 'POST', body: credenciales })
}

export function registrarUsuario(datos) {
  return request('/auth/register', { method: 'POST', body: datos })
}

export function obtenerProductos(filtros = {}) {
  return request(`/productos${toQueryString(filtros)}`)
}

export function obtenerProductoPorId(id) {
  return request(`/productos/${encodeURIComponent(id)}`)
}

export function procesarCompra(items, options = {}) {
  return request('/compras', { method: 'POST', body: { items, ...options } })
}

export function obtenerHistorialCompras() {
  return request('/compras/historial')
}

export function crearProducto(datos) {
  return request('/productos', { method: 'POST', body: datos })
}

export function actualizarProducto(id, datos) {
  return request(`/productos/${encodeURIComponent(id)}`, { method: 'PUT', body: datos })
}

export function eliminarProducto(id) {
  return request(`/productos/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function guardarSesion(response) {
  if (response?.token) localStorage.setItem('nexus-token', response.token)
  if (response?.user) localStorage.setItem('nexus-user', JSON.stringify(response.user))
  window.dispatchEvent(new Event('nexus-auth-change'))
}

export function cerrarSesion() {
  localStorage.removeItem('nexus-token')
  localStorage.removeItem('nexus-user')
  window.dispatchEvent(new Event('nexus-auth-change'))
}
