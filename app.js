import express from "express";
import { criarRotas } from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

export function criarApp() {
    const app = express();
    app.use(express.json());

    app.get("/api/health", (req, res) => res.json({ status: "ok" }));

    app.use("/api", criarRotas());

    app.use((req, res) => res.status(404).json({ erro: "recurso não encontrado" }));

    app.use(errorHandler);

    return app;
}
