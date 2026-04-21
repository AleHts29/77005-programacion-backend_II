import { Command } from 'commander'
import dotenv from 'dotenv';


const program = new Command();

// configuramos commander
program // apertura
    .option('-d <debug>', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servicio', 9090)
    .option('--mode <mode>', 'Modo de trabajo del servicio', 'develop')
program.parse() // cierre

const enviroment = program.opts().mode

dotenv.config({
    path: enviroment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
})

// console.log("Options Commander", program.opts());


// 2do Listeners

// exit
// process.on("exit", code => {
//     console.log("Este codigo se ejecuta antes de salir del proceso.");
//     console.log("Codigo de salida del proceso: " + code);
// })

// //uncaughtException
// process.on("uncaughtException", code => {
//     console.log("Esta exception no fue capturada, o controlada.");
//     console.log(`Exception no capturada: ${exception}`)
// })

// process.on("message", message => {
//     console.log("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
//     console.log(`Mensaje recibido: ${message}`);
// });

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD
}