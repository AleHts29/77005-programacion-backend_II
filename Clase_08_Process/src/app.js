import express from 'express'
import handlebars from 'express-handlebars';
import program from './config/config.js'
import __dirname from './utils.js';
import porcessRouter from './routes/process.router.js'

const app = express();

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


const SERVER_PORT = program.port

app.use("/", porcessRouter)


app.listen(SERVER_PORT, () => {
    console.log(`Server run on port ${SERVER_PORT}`);
    // console.log("process", process.argv.slice(2));


    //2do - listeners
    // process.exit(555)

    // console();


})