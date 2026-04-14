import { Router } from "express";
import PetsService from '../services/db/pets.service.js';

const router = Router();
const petsService = new PetsService();

router.get("/", async (req, res) => {

});



router.post("/", async (req, res) => {

});



router.get("/:word", async (req, res) => {

});



router.put("/:word", async (req, res) => {

});



router.get("*", (req, res) => {

});



router.param("word", async (req, res, next, name) => {

});

export default router;