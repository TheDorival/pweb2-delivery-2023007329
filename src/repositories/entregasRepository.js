/** @typedef {import('./contracts.js').IEntregasRepository} IEntregasRepository */

/**
 * @implements {IEntregasRepository}
 */
export class EntregasRepository {
  /** @param {import('../database/database.js').Database} database */
  constructor(database) {
    this.database = database;
  }

  async criar(dados) {
    const entrega = { ...dados, id: this.database.proximoId() };
    this.database.tabela.push(entrega);
    return entrega;
  }

  async buscarPorId(id) {
    return this.database.tabela.find((e) => e.id == id) ?? null;
  }

  async listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    return this.database.tabela.filter(
      (e) =>
        (status === undefined || e.status === status) &&
        (motoristaId === undefined || e.motoristaId == motoristaId),
    );
  }

  async atualizar(id, alteracoes) {
    const indice = this.database.tabela.findIndex((e) => e.id == id);
    if (indice === -1) return null;
    const atualizada = { ...this.database.tabela[indice], ...alteracoes };
    this.database.tabela[indice] = atualizada;
    return atualizada;
  }

  async deletar(id) {
    const indice = this.database.tabela.findIndex((entrega) => entrega.id == id);
    if (indice === -1) return false;
    this.database.tabela.splice(indice, 1);
    return true;
  }
}
