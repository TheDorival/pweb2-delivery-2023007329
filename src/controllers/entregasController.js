import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class EntregasController {
    constructor(servico) {
        this.servico = servico;
    }

    criar = asyncHandler(async (req, res) => {
        const instanciaEntrega = await this.servico.criar(
            req.body,
        )
        res.status(201).json(instanciaEntrega);
    });

    listar = asyncHandler(async (req, res) => {
        const entregas = await this.servico.listar();

        if (req.query.status) {
            const entregasFiltradas = entregas.filter(
                (entrega) => entrega.status === req.query.status,
            );
            res.json(entregasFiltradas)
            return
        }

        res.json(entregas);
    });

    buscarPorId = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));
        res.json(entrega);
    });

    avancar = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));

        if (entrega.status === "CRIADA") {
            const entregaAtualizada = await this.servico.atualizar(
                Number(id),
                {
                    status: "EM_TRANSITO",
                    historico: [
                        ...entrega.historico,
                        {data: new Date().toISOString(), descricao: "transitar"},
                    ],
                },
            );
            res.json(entregaAtualizada);
            return;
        }

        if (entrega.status === "EM_TRANSITO") {
            const entregaAtualizada = await this.servico.atualizar(
                Number(id),
                {
                    status: "ENTREGUE",
                    historico: [
                        ...entrega.historico,
                        {data: new Date().toISOString(), descricao: "entregar"},
                    ],
                },
            );
            res.json(entregaAtualizada);
            return;
        }
        throw new AppError("Entrega já foi finalizada", 422);
    });

    cancelar = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));

        if (entrega.status === "ENTREGUE" || entrega.status === "CANCELADA") {
            throw new AppError("Entrega já foi finalizada", 422);
        }

        const entregaAtualizada = await this.servico.atualizar(
            Number(id),
            {
                status: "CANCELADA",
                historico: [
                    ...entrega.historico,
                    {data: new Date().toISOString(), descricao: "cancelar"},
                ],
            },
        );
        res.json(entregaAtualizada);
    });


    listarHistorico = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));
        res.json(entrega.historico)
    });
}
