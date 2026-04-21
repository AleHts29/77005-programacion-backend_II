import { Router } from 'express';
import { fork } from 'child_process'

const router = Router()

let count = 0
router.get('/count', (req, res) => {
    res.render('index', { count: count++ });
});


router.get("/suma", (req, res) => {
    res.send(`El resultado de la operacion es: ${operacionCompleja()}`)
});

const operacionCompleja = () => {
    let result = 0
    for (let index = 0; index < 5e9; index++) {
        result += index
    }
    return result
}


router.get("/suma-worker-process", (req, res) => {
    const child = fork('./src/fork/operations.js')
    child.send("Start")
    child.on('message', result => {
        res.send(`El resultado de la operacion es ${result}`)
    })
});



export default router