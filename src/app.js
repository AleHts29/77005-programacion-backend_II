import express from 'express';
import viewsRouter from '../routes/views.routes.js';

import session from 'express-session';

const app = express();
const PORT = 3000;



//  Configuración de la sesión
app.use(session({
    secret: 'mi_secreto_para_firmar_sesiones', // <- Secreto para firmar la sesión
    resave: true, // <- guardar la sesión si no ha sido modificada
    saveUninitialized: true, // <- Guardar la sesión aunque no se haya inicializado
}))

app.get('/', (req, res) => {
    res.send('Hola Mundo!');
});

app.use('/cookies', viewsRouter)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});