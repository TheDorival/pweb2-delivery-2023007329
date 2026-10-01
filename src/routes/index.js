import { Router } from "express";
import { Database } from "../database/database.js";
import { EntregasRepository } from "../repositories/entregasRepository.js";
import { MotoristasRepository } from "../repositories/motoristasRepository.js";
import { EntregasService } from "../services/entregasService.js";
import { MotoristasService } from "../services/motoristasService.js";
import { EntregasController } from "../controllers/entregasController.js";
import { MotoristasController } from "../controllers/motoristasController.js";
import { criarEntregasRoutes } from "./entregasRoutes.js";
import { criarMotoristasRoutes } from "./motoristasRoutes.js";

export function criarRotas() {
    const database = new Database();

    const entregasRepo = new EntregasRepository(database);
    const motoristasRepo = new MotoristasRepository(database);

    const entregasService = new EntregasService(entregasRepo, motoristasRepo);
    const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);

    const entregasController = new EntregasController(entregasService);
    const motoristasController = new MotoristasController(motoristasService);

    const router = Router();

    router.use("/entregas", criarEntregasRoutes(entregasController));
    router.use("/motoristas", criarMotoristasRoutes(motoristasController));

    return router;
}
