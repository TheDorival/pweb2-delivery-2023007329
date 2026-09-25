export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  async criar(corpo) {
    const instanciaEntrega = {
      id: this.database.proximoId(),
      status: "CRIADA",
      motoristaId: null,
      historico: [{ data: new Date().toISOString(), descricao: "criar" }],
      ...corpo,
    };
    this.database.tabela.push(instanciaEntrega);
    return instanciaEntrega;
  }

  async buscarPorId(id) {
    const entregaComId = this.database.tabela.find(
      (entrega) => entrega.id == id,
    );
    return entregaComId;
  }

  async buscarPorFiltro(filtro) {
    const entregaFiltrada = this.database.tabela.find(filtro);
    return entregaFiltrada;
  }

  async listar() {
    return this.database.tabela;
  }

  async atualizar(id, alteracoes) {
    const indice = this.database.tabela.findIndex(
      (entrega) => entrega.id == id,
    );
    if (indice == -1) return;
    const entregaComId = this.database.tabela[indice];
    const entregaAlterada = {
      ...entregaComId,
      ...alteracoes,
    };
    this.database.tabela[indice] = entregaAlterada;
    return entregaAlterada;
  }

  async deletar(id) {
    const indice = this.database.tabela.findIndex(
      (entrega) => entrega.id == id,
    );
    if (indice == -1) return false;
    this.database.tabela.splice(indice, 1);
    return true;
  }
}
