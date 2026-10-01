/** @typedef {import('./contracts.js').IMotoristasRepository} IMotoristasRepository */

/**
 * @implements {IMotoristasRepository}
 */
export class MotoristasRepository {
  /** @param {import('../database/database.js').Database} database */
  constructor(database) {
    this.database = database;
  }

  async criar(dados) {
    const motorista = { ...dados, id: this.database.proximoIdMotorista() };
    this.database.tabelaMotoristas.push(motorista);
    return motorista;
  }

  async buscarPorId(id) {
    return this.database.tabelaMotoristas.find((m) => m.id == id) ?? null;
  }

  async buscarPorCpf(cpf) {
    return this.database.tabelaMotoristas.find((m) => m.cpf === cpf) ?? null;
  }

  async listarTodos() {
    return this.database.tabelaMotoristas;
  }
}
