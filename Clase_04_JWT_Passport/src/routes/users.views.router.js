import { Router } from "express";
import { passportCall, authorization } from "../utils.js";




const router = Router();
const JWT_STRATEGY = "jwt";
const ROL_USER = "admin";

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

// Cuaando ya tenemos una session activa con los datos del user, renderizamos la vista profile
router.get("/profile",
    passportCall(JWT_STRATEGY),
    authorization(ROL_USER), // <-- esta fallando la validacion de rol, revisar utils.js
    (req, res) => {
        res.render("profile", { user: req.user });
    });

export default router;