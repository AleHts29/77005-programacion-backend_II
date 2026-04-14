import CustomRouter from './custom.router.js';
import UserService from '../../services/db/users.service.js';
import { createHash, isValidPassword, generateJWToken } from '../../utils.js';

export default class UsersExtendRouter extends CustomRouter {
    init() {

        const userService = new UserService(); // <-- instancia de la class Model de mongo


        this.get("/", ["PUBLIC"], async (req, res) => {
            res.sendSuccess("Test 01 - userRouter")
        })

        this.get("/currentUser", ["USER", "USER_PREMIUM"], async (req, res) => {
            res.sendSuccess(req.user)
        })

        this.get("/premiumUser", ["USER_PREMIUM"], async (req, res) => {
            res.sendSuccess(req.user)
        })


        this.get("/adminUser", ["ADMIN"], async (req, res) => {
            res.sendSuccess(req.user)
        })


        // Login
        this.post("/login", ["PUBLIC"], async (req, res) => {
            const { email, password } = req.body;

            const user = await userService.findByUsername(email);
            if (!user) {
                return res.sendClientError('usuario no existe')
            }

            // validar pass
            if (!isValidPassword(user, password)) {
                return res.sendClientError('credenciales invalidas')
            }


            // crear obj que voy a convertir en JWT
            const tokenUser = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role
            }

            // convertimos a JWT
            const access_token = generateJWToken(tokenUser)
            res.sendSuccess(access_token)
        })


        // register
        this.post("/register", ["PUBLIC"], async (req, res) => {
            const { first_name, last_name, email, age, password } = req.body;

            const exists = await userService.findByUsername(email);
            if (exists) {
                return res.sendClientError('usuario ya existe')
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            const user = await userService.save(newUser)

            res.sendSuccess(user._id)
        })


    }
};