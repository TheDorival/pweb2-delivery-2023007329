import { AppError } from "../utils/appError.js";

/** @typedef {import('../repositories/contracts.js').IEntregasRepository} IEntregasRepository */
/** @typedef {import('../repositories/contracts.js').IMotoristasRepository} IMotoristasRepository */
export class EntregasService {
  /**
   * @param {IEntregasRepository} entregasRepo
   * @param {IMotoristasRepository} motoristasRepo
   */
  constructor(entregasRepo, motoristasRepo) {
    this.entregasRepo = entregasRepo;
    this.motoristasRepo = motoristasRepo;
  }
  async criar(dados) {
    const { descricao, origem, destino } = dados;

    if (origem === destino)
      throw new AppError("Origem e destino não podem ser iguais", 400);

    const todas = await this.entregasRepo.listarTodos();
    const duplicada = todas.some(
      (entrega) =>
        entrega.descricao === descricao &&
        entrega.origem === origem &&
        entrega.destino === destino &&
        entrega.status !== "ENTREGUE" &&
        entrega.status !== "CANCELADA",
    );
    if (duplicada)
      throw new AppError("Já existe uma entrega ativa com esses dados", 409);

    return await this.entregasRepo.criar({
      descricao,
      origem,
      destino,
      status: "CRIADA",
      motoristaId: null,
      historico: [{ data: new Date().toISOString(), descricao: "criar" }],
    });
  }

  async buscarPorId(id) {
    const entrega = await this.entregasRepo.buscarPorId(id);
    if (!entrega) throw new AppError("Entrega não foi encontrada", 404);
    return entrega;
  }

  async listar(filtros) {
    return await this.entregasRepo.listarTodos(filtros);
  }

  async atualizar(id, alteracoes) {
    await this.buscarPorId(id);
    return await this.entregasRepo.atualizar(id, alteracoes);
  }

  async avancar(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === "CRIADA") {
      return await this.atualizar(id, {
        status: "EM_TRANSITO",
        historico: [
          ...entrega.historico,
          { data: new Date().toISOString(), descricao: "transitar" },
        ],
      });
    }

    if (entrega.status === "EM_TRANSITO") {
      return await this.atualizar(id, {
        status: "ENTREGUE",
        historico: [
          ...entrega.historico,
          { data: new Date().toISOString(), descricao: "entregar" },
        ],
      });
    }

    throw new AppError("Entrega já foi finalizada", 422);
  }

  async cancelar(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === "ENTREGUE" || entrega.status === "CANCELADA") {
      throw new AppError("Entrega já foi finalizada", 422);
    }

    return await this.atualizar(id, {
      status: "CANCELADA",
      historico: [
        ...entrega.historico,
        { data: new Date().toISOString(), descricao: "cancelar" },
      ],
    });
  }

  async deletar(id) {
    await this.buscarPorId(id);
    return await this.entregasRepo.deletar(id);
  }
}
