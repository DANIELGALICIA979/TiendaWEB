const API_URL = 'http://localhost:3000/api';

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