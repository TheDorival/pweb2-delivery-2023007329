import { Router } from "express";
import entregasRoutes from "./entregasRoutes.js";

export function criarRotas() {
    const router = Router();

    router.use("/entregas", entregasRoutes);

    return router;
}
