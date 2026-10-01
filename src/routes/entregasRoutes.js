import { Router } from "express";
import { validarCamposEntrega } from "../middlewares/validarCamposEntrega.js";

/** @param {import('../controllers/entregasController.js').EntregasController} controller */
export function criarEntregasRoutes(controller) {
  const router = Router();

  router.post("/", validarCamposEntrega, controller.criar);

  router.get("/", controller.listar);

  router.get("/:id", controller.buscarPorId);

  router.patch("/:id/avancar", controller.avancar);

  router.patch("/:id/cancelar", controller.cancelar);

  router.patch("/:id/atribuir", controller.atribuir);

  router.get("/:id/historico", controller.listarHistorico);

  return router;
}
