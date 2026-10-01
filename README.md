# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale e rode:
   ```bash
   npm install
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## O que implementar (em `src/`)

```
src/
├── controllers/   # traduz HTTP ↔ service (sem regra de negócio)
├── services/      # TODA a regra de negócio
├── repositories/  # só acesso a dados
├── database/      # persistência SIMULADA em memória (sem banco real, sem ORM)
├── routes/        # composição das dependências (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀

## Rotas da API

### Entregas

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/api/entregas` | `{ descricao, origem, destino }` | 201 entrega (`CRIADA`, 1 evento no histórico) | 400 campos/origem=destino · 409 duplicata ativa |
| GET | `/api/entregas` | — | 200 array | — |
| GET | `/api/entregas?status=EM_TRANSITO` | — | 200 array filtrado | — |
| GET | `/api/entregas/:id` | — | 200 entrega | 404 |
| PATCH | `/api/entregas/:id/avancar` | — | 200 entrega (novo status) | 404 · 422 transição inválida |
| PATCH | `/api/entregas/:id/cancelar` | — | 200 entrega (`CANCELADA`) | 404 · 422 já ENTREGUE/CANCELADA |
| PATCH | `/api/entregas/:id/atribuir` | `{ motoristaId }` | 200 entrega (com `motoristaId`) | 404 · 422 entrega não `CRIADA` ou motorista `INATIVO` |
| GET | `/api/entregas/:id/historico` | — | 200 array de eventos | 404 |

### Motoristas

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/api/motoristas` | `{ nome, cpf, placaVeiculo? }` | 201 motorista (status `ATIVO`) | 400 campos · 409 CPF duplicado |
| GET | `/api/motoristas` | — | 200 array | — |
| GET | `/api/motoristas/:id` | — | 200 motorista | 404 |
| GET | `/api/motoristas/:id/entregas` | — | 200 só as entregas do motorista | 404 |
| GET | `/api/motoristas/:id/entregas?status=CRIADA` | — | 200 filtro combinado | 404 |

## Composição das dependências

Os contratos (`src/repositories/contracts.js`) definem `IEntregasRepository` e
`IMotoristasRepository`; os services dependem só desses contratos, nunca da implementação
concreta. A composição (`new` de repository, service e controller) acontece em **um único ponto**:
`src/routes/index.js`.

```
src/routes/index.js  (composition root)
│
├── new Database()
│
├── new EntregasRepository(database)  ──┐
├── new MotoristasRepository(database) ─┤  implementam IEntregasRepository /
│                                        │  IMotoristasRepository (contracts.js)
├── new EntregasService(entregasRepo, motoristasRepo)   ──┐
├── new MotoristasService(motoristasRepo, entregasRepo) ──┤  dependem só do CONTRATO
│                                                          │  (podem receber um Mock no lugar)
├── new EntregasController(entregasService)   ──┐
├── new MotoristasController(motoristasService) ─┤  HTTP ↔ service
│
├── criarEntregasRoutes(entregasController)   → monta em /api/entregas
└── criarMotoristasRoutes(motoristasController) → monta em /api/motoristas
```

A regra "motorista `INATIVO` não pode ser atribuído" mora no `EntregasService` (é regra da
atribuição), não no `MotoristasService`.

**Teste de inversão de dependência:** `test/testeMock.js` troca os repositories por Mocks em
memória que só respeitam o contrato (sem usar `Database`) e roda os fluxos principais dos dois
services. Rode com `npm test`. Se algum service usar algo fora do contrato, o Mock lança
`TypeError`.
