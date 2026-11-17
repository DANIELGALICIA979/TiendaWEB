require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

app.use(express.json());

function createSupabaseClient(url, anonKey) {
    return createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false,
        },
    });
}

// Ruta de prueba
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente'
    });
});

app.get('/api/catalogo', async (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio del catálogo no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const [gamesResult, categoriesResult, platformsResult] = await Promise.all([
            supabase
                .from('games')
                .select('id,title,slug,description,synopsis,developer,publisher,franchise,release_date,cover_url,banner_url,game_categories(categories(id,name,slug)),offers!inner(id,price,original_price,currency,edition,delivery_type,promotion_starts_at,promotion_ends_at,status,platforms(id,name,slug),regions(id,name,code),drms(id,name,slug))')
                .eq('offers.status', 'published')
                .order('title'),
            supabase.from('categories').select('id,name,slug').order('name'),
            supabase.from('platforms').select('id,name,slug').eq('active', true).order('name'),
        ]);

        const failedQuery = [gamesResult, categoriesResult, platformsResult].find(result => result.error);
        if (failedQuery) {
            console.error('Catalog query failed:', failedQuery.error.code || failedQuery.error.message);
            return res.status(502).json({ message: 'No se pudieron cargar los juegos desde la base de datos.' });
        }

        const games = gamesResult.data.map(game => ({
            id: game.id,
            title: game.title,
            slug: game.slug,
            description: game.synopsis || game.description,
            developer: game.developer,
            publisher: game.publisher,
            franchise: game.franchise,
            release_date: game.release_date,
            cover_url: game.cover_url,
            banner_url: game.banner_url,
            categories: (game.game_categories || [])
                .map(link => link.categories)
                .filter(Boolean),
            offers: (game.offers || []).map(offer => ({
                id: offer.id,
                price: Number(offer.price),
                original_price: offer.original_price === null ? null : Number(offer.original_price),
                currency: offer.currency.trim(),
                edition: offer.edition,
                delivery_type: offer.delivery_type,
                promotion_starts_at: offer.promotion_starts_at,
                promotion_ends_at: offer.promotion_ends_at,
                platform: offer.platforms,
                region: offer.regions,
                drm: offer.drms,
            })),
        }));

        const categoryIds = new Set(games.flatMap(game => game.categories.map(category => category.id)));
        const platformIds = new Set(games.flatMap(game => game.offers.map(offer => offer.platform?.id)));

        return res.json({
            games,
            categories: categoriesResult.data.filter(category => categoryIds.has(category.id)),
            platforms: platformsResult.data.filter(platform => platformIds.has(platform.id)),
        });
    } catch (error) {
        console.error('Catalog request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con la base de datos del catálogo.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        return res.status(400).json({ message: 'Ingresa tu correo y contraseña.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de autenticación no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            if (error.code === 'email_not_confirmed') {
                return res.status(403).json({ message: 'Confirma tu correo antes de iniciar sesión.' });
            }

            if (error.status === 400 || error.status === 401) {
                return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
            }

            if (error.status === 429) {
                return res.status(429).json({ message: 'Demasiados intentos. Espera un momento y vuelve a probar.' });
            }

            console.error('Supabase login failed:', error.code || error.status || 'unknown error');
            return res.status(502).json({ message: 'No se pudo validar el acceso con Supabase.' });
        }

        if (!data.session) {
            return res.status(401).json({ message: 'Supabase no devolvió una sesión válida.' });
        }

        return res.json({
            session: data.session,
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
            },
        });
    } catch (error) {
        console.error('Supabase login request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de autenticación.' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!username || username.length > 40 || !email || password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ message: 'Revisa el gamertag, correo y los requisitos de contraseña.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de registro no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            if (error.code === 'user_already_exists' || error.status === 409) {
                return res.status(409).json({ message: 'No se pudo crear la cuenta. Verifica que el correo y gamertag estén disponibles.' });
            }

            if (error.status === 400) {
                return res.status(400).json({ message: 'Supabase rechazó los datos. Revisa el correo y los requisitos de contraseña.' });
            }

            if (error.status === 429) {
                return res.status(429).json({ message: 'Demasiados intentos. Espera un momento y vuelve a probar.' });
            }

            console.error('Supabase registration failed:', error.code || error.status || 'unknown error');
            return res.status(502).json({ message: 'No se pudo crear la cuenta en Supabase.' });
        }

        if (!data.user) {
            return res.status(502).json({ message: 'Supabase no devolvió el usuario creado.' });
        }

        return res.status(201).json({
            user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
            },
            session: data.session,
            confirmationRequired: !data.session,
        });
    } catch (error) {
        console.error('Supabase registration request failed:', error.message);
        return res.status(502).json({ message: 'No se pudo conectar con el servicio de registro.' });
    }
});

app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = typeof req.body?.refresh_token === 'string' ? req.body.refresh_token : '';
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se recibió el token de renovación.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(503).json({ message: 'El servicio de autenticación no está configurado.' });
    }

    try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

        if (error || !data.session) {
            return res.status(401).json({ message: 'La sesión expiró. Inicia sesión de nuevo.' });
        }

        return res.json({ session: data.session });
    } catch (error) {
        console.error('Supabase session refresh failed:', error.message);
        return res.status(502).json({ message: 'No se pudo renovar la sesión.' });
    }
});

// Iniciar servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});