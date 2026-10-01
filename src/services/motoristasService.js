import { AppError } from "../utils/appError.js";

/** @typedef {import('../repositories/contracts.js').IMotoristasRepository} IMotoristasRepository */
/** @typedef {import('../repositories/contracts.js').IEntregasRepository} IEntregasRepository */

export class MotoristasService {
  /**
   * @param {IMotoristasRepository} motoristasRepo
   * @param {IEntregasRepository} entregasRepo
   */
  constructor(motoristasRepo, entregasRepo) {
    this.motoristasRepo = motoristasRepo;
    this.entregasRepo = entregasRepo;
  }

  async criar(dados) {
    const { nome, cpf, placaVeiculo } = dados;

    const existente = await this.motoristasRepo.buscarPorCpf(cpf);
    if (existente) {
      throw new AppError("Já existe um motorista cadastrado com esse CPF", 409);
    }

    return await this.motoristasRepo.criar({
      nome,
      cpf,
      placaVeiculo,
      status: "ATIVO",
    });
  }

  async listar() {
    return await this.motoristasRepo.listarTodos();
  }

  async buscarPorId(id) {
    const motorista = await this.motoristasRepo.buscarPorId(id);
    if (!motorista) throw new AppError("Motorista não foi encontrado", 404);
    return motorista;
  }

  async entregasDoMotorista(id, status) {
    await this.buscarPorId(id);
    return await this.entregasRepo.listarTodos({ motoristaId: id, status });
  }
}
