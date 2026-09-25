import { AppError } from "../utils/appError.js";

export class EntregaService {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }
  async criar(corpo) {
    if (corpo.origem === corpo.destino)
      throw new AppError("Origem e destino não podem ser iguais", 400);

    const duplicada = await this.repositorio.buscarPorFiltro(
      (entrega) =>
        entrega.descricao === corpo.descricao &&
        entrega.origem === corpo.origem &&
        entrega.destino === corpo.destino &&
        entrega.status !== "ENTREGUE" &&
        entrega.status !== "CANCELADA",
    );
    if (duplicada)
      throw new AppError("Já existe uma entrega ativa com esses dados", 409);

    return await this.repositorio.criar(corpo);
  }

  async buscarPorId(id) {
    const entregaComId = await this.repositorio.buscarPorId(id);
    if (!entregaComId) throw new AppError("Entrega não foi encontrada", 404);
    return entregaComId;
  }

  async listar() {
    return await this.repositorio.listar();
  }

  async atualizar(id, alteracoes) {
    await this.buscarPorId(id);
    return await this.repositorio.atualizar(id, alteracoes);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    return await this.repositorio.deletar(id);
  }
}
