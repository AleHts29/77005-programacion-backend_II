import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// crear hash
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));


// validar hash = es el que esta en la DB y el password es el que el usuario ingresa
export const validatePassword = (password, hash) => bcrypt.compareSync(password, hash);


// =============================
// JWT
// =============================
// secreto
// const JWT_SECRET = "este-es-un-secreto-muy-seguro";
export const JWT_SECRET = "f268aeae84d56d506c7e18b803574d6a932b7ecf27d88acf76502abcda049a44";

// generar token(JWT)
export const generateToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' });
}



// validar token(JWT)
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("JWT-Header: ", authHeader);

    if (!authHeader) {
        return res.status(401).send({ error: "User not authenticated or missing token." });
    }


    // split --> ["Bearer", "token"]
    const token = authHeader.split(' ')[1];


    // validamos
    jwt.verify(token, JWT_SECRET, (err, credentials) => {
        if (err) {
            return res.status(403).send({ error: "Invalid token." });
        }

        req.user = credentials.user;
        next();

    })
}



export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a JWT_STRATEGY");
        console.log("strategy: ", strategy);


        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).send({ error: "User not authenticated." });
            }


            console.log("Usuario obtenido", user);

            req.user = user;
            next();
        })(req, res, next);
    }
}



export const authorization = (role) => {


    return async (req, res, next) => {

        console.log("Start validations");

        if (!req.user) {
            console.log("User not found in JWT");
            return res.status(401).send({ error: "Unauthorized: User not found in JWT" });
        }


        if (req.user.role !== role) {
            console.log("User does not have the required role");
            return res.status(403).send({ error: "Forbidden: User does not have the required role" });
        }

        console.log("End validations");

        next();
    }
}

export default __dirname;



// ejemplo de token
// `[Bearer, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4MWE5YjBiMWYyYWVhZmU2YjZjYzZmZiIsImZpcnN0X25hbWUiOiJBbnRvbmVsYSIsImxhc3RfbmFtZSI6IkxvcGV6IiwiZW1haWwiOiJhbnRvMTJAZ21haWwuY29tIiwiYWdlIjozNywicGFzc3dvcmQiOiIkMmIkMTAkR29rZGwwLnR2SldSRlZPZWNPRWlJTy9oNkIyeEJlRzVDUzAydUsxVS5iYUc3c1M1RWNRYWkiLCJfX3YiOjB9LCJpYXQiOjE3NDcxNzk2MDAsImV4cCI6MTc0NzI2NjAwMH0.asw97GTgNhf7-YoKEZC-gjW4YrvRXZzG-eHcYqvvx8k]`