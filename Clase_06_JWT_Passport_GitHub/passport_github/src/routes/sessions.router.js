import { Router } from 'express';
import userModel from '../models/user.model.js';
import { createHash, generateToken } from '../utils.js';
import passport from 'passport';

const router = Router();

// githab
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: "/github/error" }), async (req, res) => {

    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    req.session.admin = true;

    res.redirect("/users/profile");


})

// /api/sessions/register <- API
router.post("/register", passport.authenticate('register', { failureRedirect: "/api/sessions/fail-register" }), async (req, res) => {
    console.log("Registrando nuevo usuario");
    res.send({ status: "success", message: "User registered con exito" });
});

// /api/sessions/login <- API
router.post("/login", passport.authenticate('login', { failureRedirect: "/api/sessions/fail-login" }), async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" });
    }

    // Si el user existe, creamos una session (cookie)
    // req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age
    // }

    // usando JWT
    const access_token = generateToken(user);


    res.send({ status: "success", access_token: access_token });
});


router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;