// Delivery Tracker — Exercício do Cap. 4.
// Ponto de entrada: só sobe o servidor. A config do Express está em app.js.
import { criarApp } from "./app.js";

const app = criarApp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));
