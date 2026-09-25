import express from "express";
import { criarRotas } from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

export function criarApp() {
    const app = express();
    app.use(express.json());

    // Health check exigido pelo contrato de execução (não remova).
    app.get("/api/health", (req, res) => res.json({ status: "ok" }));

    app.use("/api", criarRotas());

    // 404 para rotas não mapeadas (mantenha por último, antes do error handler).
    app.use((req, res) => res.status(404).json({ erro: "recurso não encontrado" }));

    // Error handler sempre por último.
    app.use(errorHandler);

    return app;
}
