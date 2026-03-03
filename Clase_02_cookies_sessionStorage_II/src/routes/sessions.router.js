import { Router } from 'express';
import userModel from '../models/user.model.js';

const router = Router();
// /api/sessions/register <- API
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    console.log(req.body);

    // Validamos que el user no exista.
    const exists = await userModel.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }


    // DTO - Data Transfer Object
    const user = {
        first_name,
        last_name,
        email,
        age,
        password // por ahora no va encriptada, mas adelante
    }


    // Guardamos el user en la DB.
    const result = await userModel.create(user);
    console.log(result);

    res.send({ status: "success", message: "User registered ID: " + result._id });
});

// /api/sessions/login <- API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validamos que el user exista.
    const user = await userModel.findOne({ email, password });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Si el user existe, creamos una session (cookie)
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    console.log("API_Login", req.session.user);


    res.send({ status: "success", message: "User logged in" });

});

export default router;