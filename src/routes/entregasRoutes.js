import { Router } from "express";
import { Database } from "../database/database.js";
import { EntregasRepository } from "../repositories/entregasRepository.js";
import { EntregaService } from "../services/entregasService.js";
import { EntregasController } from "../controllers/entregasController.js";


const database = new Database();
const repositorio = new EntregasRepository(database);
const servico = new EntregaService(repositorio);
const controller = new EntregasController(servico);

const router = Router();

router.post("/", controller.criar);

router.get("/", controller.listar);

router.get("/:id", controller.buscarPorId);

router.patch("/:id/avancar", controller.avancar);

router.patch("/:id/cancelar", controller.cancelar);

router.get("/:id/historico", controller.listarHistorico);

export default router;
