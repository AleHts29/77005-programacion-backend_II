import { Router } from 'express';
import userModel from '../models/user.model.js';
import { createHash, generateToken, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();



// /api/sessions/register <- API
router.post("/register", passport.authenticate('register', { failureRedirect: "/api/sessions/fail-register" }), async (req, res) => {
    console.log("Registrando nuevo usuario");
    res.status(201).send({ status: "success", message: "User registered con exito" });
});

// /api/sessions/login <- API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {

        // Buscamos el usuario en la base de datos
        const user = await userModel.findOne({ email });


        // Si el usuario no existe, respondemos con un error
        if (!user) {
            return res.status(401).send({ status: "error", error: "Invalid credentials" });
        }


        // Si el usuario existe, verificamos la contraseña
        if (!validatePassword(password, user.password)) {
            return res.status(401).send({ status: "error", error: "Invalid credentials" });
        }


        // si la validación es correcta, generamos un obj 
        // DTO
        const userInfo = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        }


        // con la info generamos el JWT (payload)
        const token = generateToken(userInfo);
        console.log("Token generado: ", token);



        // Almacenamos el token en una cookie (httpOnly)
        res.cookie("jwtCookieToken", token, { httpOnly: true })
        res.redirect("/users/profile");
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
})


router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;