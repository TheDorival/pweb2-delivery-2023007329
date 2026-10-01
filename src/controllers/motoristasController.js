import { asyncHandler } from "../utils/asyncHandler.js";

export class MotoristasController {
    constructor(servico) {
        this.servico = servico;
    }

    criar = asyncHandler(async (req, res) => {
        const motorista = await this.servico.criar(req.body);
        res.status(201).json(motorista);
    });

    listar = asyncHandler(async (req, res) => {
        const motoristas = await this.servico.listar();
        res.json(motoristas);
    });

    buscarPorId = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const motorista = await this.servico.buscarPorId(Number(id));
        res.json(motorista);
    });

    entregasDoMotorista = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const entregas = await this.servico.entregasDoMotorista(Number(id), req.query.status);
        res.json(entregas);
    });
}
