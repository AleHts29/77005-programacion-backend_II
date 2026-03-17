import passport from 'passport';
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import userModel from '../models/user.model.js';
import { JWT_SECRET, createHash, validatePassword } from '../utils.js';


// declaramo la estrategia local de passport
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;


/**
 * Función para inicializar Passport y definir las estrategias de autenticación.
 */
const initializePassport = () => {


    // Estrategia de JWT
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy");
            try {
                console.log("JWT obtenido del payload", jwt_payload);
                return done(null, jwt_payload.user);
            } catch (error) {
                return done(error);
            }
        }
    ))



    // Estrategia de registro
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, // Permite acceder al objeto `req` dentro de la función de autenticación
            usernameField: 'email' // Definimos que el "username" será el campo "email"
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            console.log(req.body);

            try {
                // Validamos que el user exista.
                const exists = await userModel.findOne({ email });
                if (exists) {
                    return done(null, false, { message: "User already exists" });
                }

                // DTO - Data Transfer Object
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // password // por ahora no va encriptada, mas adelante
                    password: createHash(password) // encriptamos el password
                }
                // Guardamos el user en la DB.
                const result = await userModel.create(user);
                console.log("passpoort register", result);

                return done(null, result);

            } catch (error) {
                return done("Error registrando el usuario: ", error);
            }
        }
    ))


    /**
     * 📌 Serialización del Usuario
     * Se ejecuta después de una autenticación exitosa.
     * Passport almacena solo el `user._id` en la sesión en lugar de todo el objeto usuario.
     */
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });


    /**
    * 📌 Deserialización del Usuario
    * Cuando se hacen solicitudes autenticadas, Passport busca al usuario en la base de datos
    * usando el `id` guardado en la sesión.
    */
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });

}


// cookieExtractor
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
        console.log("data cookie", token);

    }
    return token;
}

export default initializePassport;