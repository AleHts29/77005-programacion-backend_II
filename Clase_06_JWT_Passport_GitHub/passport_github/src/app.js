import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

// dependencias para las sessions
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';

//import Routers
import viewsRouter from './routes/views.router.js';
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import githubLoginViewRouter from './routes/github-login.views.router.js';

import initializePassport from './config/passport.config.js';

const app = express();

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuraciones handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


//Conectamos nuestra session con el file storage.
const fileStorage = FileStore(session);


const MONGO_URL = "mongodb://localhost:27017/clase19?retryWrites=true&w=majority";
// TODO: Conectamos nuestra session con el MongoDB storage.
app.use(session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.

    // // donde guardo las sessions --> en un file
    // store: new fileStorage({ path: __dirname + '/sessions', ttl: 15, retries: 3 }),

    // donde guardo las sessions --> en MongoDB
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        //mongoOptions --> opciones de confi para el save de las sessions
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 15, // Time to live in seconds
    }),

    // _02 - Secreto
    secret: "coderS3cret",

    // _03 - Configuraciones de la session
    resave: false, // No se vuelve a guardar la session si no se ha modificado.
    saveUninitialized: true, // No se guarda una session vacía.
}))



//Middlewares Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


/*=============================================
=                  Routers                    =
=============================================*/
app.use("/", viewsRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/github", githubLoginViewRouter);



const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});



/*=============================================
=             connectMongoDB                  =
=============================================*/
const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();




// TODO: github callback: http://localhost:9090/api/sessions/githubcallback
