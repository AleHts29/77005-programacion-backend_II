import { Router } from "express";
import cookieParser from "cookie-parser";

const router = Router();


// sin Firma de cookies
// router.use(cookieParser());


// Cookies con firma
router.use(cookieParser("mi_secreto_para_firmar_cookies"));

router.get('/setcookie', (req, res) => {
    // // Establecer una cookie sin firma
    // res.cookie('myCookie', 'Esta es una cookie sin firma', { maxAge: 300000 }); // La cookie


    // Establecer una cookie CON firma
    res.cookie('myCookie', 'Esta es una cookie CON firma',
        {
            maxAge: 300000,
            signed: true // <- Indicamos que esta cookie debe ser firmada
        }); // La cookie

    // expirará en 1 hora
    res.send('Cookie CON firma establecida'); // <- Respuesta al cliente
})


router.get('/getcookie', (req, res) => {
    // // Leer la cookie sin firma
    // res.send(req.cookies)

    // Leer la cookie CON firma
    res.send(req.signedCookies) // <- Aquí accedemos a las cookies firmadas
})


router.get('/deletecookie', (req, res) => {
    res.clearCookie('myCookie'); // <- Eliminar la cookie
    res.send('Cookie eliminada');
})



// 2da Parte - Session Storage


router.get("/session", (req, res) => {

    if (req.session.counter) {
        req.session.counter++
        res.send(`Has visitado esta página ${req.session.counter} veces`);
    } else {
        req.session.counter = 1
        res.send('Bienvenido a la página de sesión. Esta es tu primera visita');
    }
})

// login
// http://localhost:3000/cookies/login?username=pepe&&password=1234
router.get('/login', (req, res) => {
    const { username, password } = req.query

    if (username !== 'pepe' || password !== '1234') {
        return res.status(401).send('Credenciales inválidas');
    } else {
        req.session.user = username; // <- Guardamos el nombre de usuario en la sesión
        req.session.isAdmin = true; // <- Indicamos que el usuario es admin (esto es solo un ejemplo, en la vida real deberías verificar esto de manera segura)
        res.send('Login exitoso');
    }
})

// logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.send('Sesión cerrada exitosamente');
    });
})



// Middleware de autenticación
function auth(req, res, next) {
    if (req.session.user === 'pepe' && req.session.isAdmin) {
        return next(); // <- Si el usuario está autenticado, continuamos con la siguiente función
    } else {
        return res.status(401).send('No estás autorizado para acceder a esta ruta');
    }
}

// Ruta protegida (solo accesible para usuarios autenticados)
router.get('/protected', auth, (req, res) => {

    res.send(`Hola ${req.session.user}, esta es una ruta protegida. Eres admin: ${req.session.isAdmin}`);

    // res.send('Ruta protegida. Acceso permitido solo para usuarios autenticados.');
})


export default router;