import { Router } from "express";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../../utils.js";

export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    };


    getRouter() {
        return this.router;
    }
    init() { } // <-- esto se usa para clases heredadas


    // get
    get(path, policies, ...callbacks) {
        console.log("Entramos por GET a customRouter");
        console.log(policies);

        this.router.get(path,
            this.handlePolices(policies),
            this.generateCustomResponses,
            this.applyCallback(callbacks)
        )
    }
    // post
    post(path, policies, ...callbacks) {
        console.log("Entramos por POST a customRouter");
        console.log(policies);

        this.router.post(path,
            this.handlePolices(policies),
            this.generateCustomResponses,
            this.applyCallback(callbacks)
        )
    }
    // put
    put(path, policies, ...callbacks) {
        console.log("Entramos por PUT a customRouter");
        console.log(policies);

        this.router.put(path,
            this.handlePolices(policies),
            this.generateCustomResponses,
            this.applyCallback(callbacks)
        )
    }
    // delete
    delete(path, policies, ...callbacks) {
        console.log("Entramos por DELETE a customRouter");
        console.log(policies);

        this.router.delete(path,
            this.handlePolices(policies),
            this.generateCustomResponses,
            this.applyCallback(callbacks)
        )
    }


    // handlePolices
    handlePolices = policies => (req, res, next) => {
        console.log("Politica a evaluar", policies);

        //Validar si tiene acceso publico:
        if (policies[0] == "PUBLIC") return next()



        // El JWT token se guarda en los headers de auth
        const authHeaders = req.headers.authorization
        console.log("token JWT", authHeaders);

        if (!authHeaders) {
            return res.status(401).send({ error: "User nor authenticated os missing token" })
        }

        const token = authHeaders.split(' ')[1] //Se hace el split para retirar la palabra Bearer.


        jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
            if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
            //Token OK
            req.user = credentials.user;
            console.log(req.user);

            if (!policies.includes(req.user.role.toUpperCase())) return res.status(403).send({ error: "El usuariuo no tiene privilegios, resa roles" })

            next();
        });



    }


    // generateCustomResponses
    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({ status: "Success", payload })
        res.sendInternalServerError = error => res.status(500).send({ status: "Error", error })
        res.sendClientError = error => res.status(400).send({ status: "Client error, Bad request from client", error })
        res.sendUnauthorizedError = error => res.status(401).send({ status: "User not authenticated or missing token", error })
        res.sendForbiddenError = error => res.status(403).send({ status: "Invalid token or user with no access", error })

        next()
    }

    // applyCallback
    applyCallback(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send(error)
            }
        })
    }
}

