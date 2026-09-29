// Delivery Tracker — Exercício do Cap. 4.

import { criarApp } from "./app.js";

const app = criarApp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));
