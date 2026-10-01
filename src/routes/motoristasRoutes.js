import { Router } from "express";
import { validarCamposMotorista } from "../middlewares/validarCamposMotorista.js";

/** @param {import('../controllers/motoristasController.js').MotoristasController} controller */
export function criarMotoristasRoutes(controller) {
  const router = Router();

  router.post("/", validarCamposMotorista, controller.criar);

  router.get("/", controller.listar);

  router.get("/:id", controller.buscarPorId);

  router.get("/:id/entregas", controller.entregasDoMotorista);

  return router;
}
