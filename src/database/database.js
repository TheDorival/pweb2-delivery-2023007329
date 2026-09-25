export class Database {
  constructor() {
    this.tabela = [];
    this.id = 0;
  }

  proximoId() {
    return this.id++;
  }
}
