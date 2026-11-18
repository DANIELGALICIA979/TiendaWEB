const API_URL = 'http://localhost:3000/api';
const CHECKOUT_REQUEST_KEY = 'nexus.checkout.request';

export async function verificarServidor() {
    try {
        const response = await fetch(`${API_URL}/status`);

        if (!response.ok) {
            throw new Error('Error en el servidor');
        }

        return await response.json();

    } catch (error) {
        throw new Error('No se pudo conectar con el backend', { cause: error });
    }
}

export async function obtenerCatalogo() {
    let response;
    try {
        response = await fetch(`${API_URL}/catalogo`);
    } catch (error) {
        throw new Error('No se pudo conectar con el catálogo.', { cause: error });
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
    }

    if (!response.ok) {
        throw new Error(result.message || 'No se pudieron cargar los juegos.');
    }

    if (!Array.isArray(result.games) || !Array.isArray(result.categories) || !Array.isArray(result.platforms)) {
        throw new Error('La respuesta del catálogo tiene un formato inválido.');
    }

    return result;
}

export async function iniciarSesion(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
    }

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo iniciar sesión.');
    }

    if (!result.session) {
        throw new Error('El servidor no devolvió una sesión válida.');
    }

    return result;
}

export async function registrarUsuario(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
    }

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo crear la cuenta.');
    }

    if (!result.user) {
        throw new Error('El servidor no devolvió el usuario creado.');
    }

    return result;
}

export function guardarSesion(session, remember = true) {
    const sessionKey = 'nexus.auth.session';
    const targetStorage = remember ? window.localStorage : window.sessionStorage;

    window.localStorage.removeItem(sessionKey);
    window.sessionStorage.removeItem(sessionKey);
    targetStorage.setItem(sessionKey, JSON.stringify(session));
}

export function leerSesion() {
    const sessionKey = 'nexus.auth.session';

    for (const storage of [window.localStorage, window.sessionStorage]) {
        const storedSession = storage.getItem(sessionKey);
        if (!storedSession) {
            continue;
        }

        try {
            const session = JSON.parse(storedSession);
            if (session?.access_token && session?.refresh_token && session?.user?.id) {
                return session;
            }
        } catch {
            storage.removeItem(sessionKey);
        }

        storage.removeItem(sessionKey);
    }

    return null;
}

export function limpiarSesion() {
    const sessionKey = 'nexus.auth.session';
    window.localStorage.removeItem(sessionKey);
    window.sessionStorage.removeItem(sessionKey);
}

export async function renovarSesion(refreshToken) {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
    }

    if (!response.ok) {
        const error = new Error(result.message || 'No se pudo renovar la sesión.');
        error.status = response.status;
        throw error;
    }

    if (!result.session) {
        throw new Error('El servidor no devolvió una sesión válida.');
    }

    return result.session;
}

async function authenticatedRequest(path, options = {}) {
    const session = leerSesion();
    if (!session?.access_token) {
        throw new Error('Tu sesión expiró. Inicia sesión para continuar.');
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
    }

    if (!response.ok) {
        throw new Error(result.message || 'No se pudo completar la solicitud.');
    }

    return result;
}

function getCheckoutRequestId(items, couponCode) {
    const lines = items.map(item => ({
        offer_id: item.offerId || item.id.slice(item.id.lastIndexOf(':') + 1),
        quantity: item.quantity,
    }))
    const fingerprint = JSON.stringify({ lines, coupon_code: couponCode })
    const storedRequest = window.localStorage.getItem(CHECKOUT_REQUEST_KEY)

    if (storedRequest) {
        try {
            const request = JSON.parse(storedRequest)
            if (request.fingerprint === fingerprint && request.id) {
                return { id: request.id, lines }
            }
        } catch {
            window.localStorage.removeItem(CHECKOUT_REQUEST_KEY)
        }
    }

    const id = window.crypto.randomUUID()
    window.localStorage.setItem(CHECKOUT_REQUEST_KEY, JSON.stringify({ id, fingerprint }))
    return { id, lines }
}

export async function confirmarCompra(items, couponCode) {
    const { id, lines } = getCheckoutRequestId(items, couponCode)
    const result = await authenticatedRequest('/orders/demo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': id,
        },
        body: JSON.stringify({ items: lines, coupon_code: couponCode }),
    })

    if (!result.order?.id || !result.order?.order_number) {
        throw new Error('El servidor no devolvió una orden válida.')
    }

    return result.order
}

export function limpiarSolicitudCompra() {
    window.localStorage.removeItem(CHECKOUT_REQUEST_KEY)
}

export async function obtenerOrden(orderId) {
    const result = await authenticatedRequest(`/orders/${encodeURIComponent(orderId)}`)
    if (!result.order) {
        throw new Error('No se encontró la orden solicitada.')
    }
    return result.order
}

export async function obtenerClavesCompradas() {
    const result = await authenticatedRequest('/keys')
    if (!Array.isArray(result.keys)) {
        throw new Error('El servidor devolvió un listado de claves inválido.')
    }
    return result.keys
}