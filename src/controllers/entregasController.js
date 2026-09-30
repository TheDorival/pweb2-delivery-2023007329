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
        const entregas = await this.servico.listar({ status: req.query.status });
        res.json(entregas);
    });

    buscarPorId = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));
        res.json(entrega);
    });

    avancar = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entregaAtualizada = await this.servico.avancar(Number(id));
        res.json(entregaAtualizada);
    });

    cancelar = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entregaAtualizada = await this.servico.cancelar(Number(id));
        res.json(entregaAtualizada);
    });


    listarHistorico = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entrega =  await this.servico.buscarPorId(Number(id));
        res.json(entrega.historico)
    });
}
