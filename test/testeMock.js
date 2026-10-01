// Teste próprio: troca a implementação dos repositories por Mocks em memória
// que respeitam só o contrato (contracts.js). Se os services dependerem de
// algo fora do contrato, isso aparece aqui como TypeError.

import { strict as assert } from "node:assert";
import { EntregasService } from "../src/services/entregasService.js";
import { MotoristasService } from "../src/services/motoristasService.js";

/** @implements {import('../src/repositories/contracts.js').IEntregasRepository} */
class MockEntregasRepository {
  #entregas = new Map();
  #proximoId = 1;

  async listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    return [...this.#entregas.values()].filter(
      (e) =>
        (status === undefined || e.status === status) &&
        (motoristaId === undefined || e.motoristaId === motoristaId),
    );
  }

  async buscarPorId(id) {
    return this.#entregas.get(id) ?? null;
  }

  async criar(dados) {
    const entrega = { ...dados, id: this.#proximoId++ };
    this.#entregas.set(entrega.id, entrega);
    return entrega;
  }

  async atualizar(id, alteracoes) {
    const atual = this.#entregas.get(id);
    if (!atual) return null;
    const atualizada = { ...atual, ...alteracoes };
    this.#entregas.set(id, atualizada);
    return atualizada;
  }
}

/** @implements {import('../src/repositories/contracts.js').IMotoristasRepository} */
class MockMotoristasRepository {
  #motoristas = new Map();
  #proximoId = 1;

  async listarTodos() {
    return [...this.#motoristas.values()];
  }

  async buscarPorId(id) {
    return this.#motoristas.get(id) ?? null;
  }

  async buscarPorCpf(cpf) {
    return [...this.#motoristas.values()].find((m) => m.cpf === cpf) ?? null;
  }

  async criar(dados) {
    const motorista = { ...dados, id: this.#proximoId++ };
    this.#motoristas.set(motorista.id, motorista);
    return motorista;
  }
}

async function main() {
  const entregasRepo = new MockEntregasRepository();
  const motoristasRepo = new MockMotoristasRepository();
  const entregasService = new EntregasService(entregasRepo, motoristasRepo);
  const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);

  const motorista = await motoristasService.criar({ nome: "Fulano", cpf: "111" });
  assert.equal(motorista.status, "ATIVO");

  await assert.rejects(
    motoristasService.criar({ nome: "Outro", cpf: "111" }),
    (e) => e.statusCode === 409,
  );

  const entrega = await entregasService.criar({
    descricao: "pacote",
    origem: "A",
    destino: "B",
  });
  assert.equal(entrega.status, "CRIADA");
  assert.equal(entrega.historico.length, 1);

  const atribuida = await entregasService.atribuirMotorista(entrega.id, motorista.id);
  assert.equal(atribuida.motoristaId, motorista.id);
  assert.equal(atribuida.historico.length, 2);

  const emTransito = await entregasService.avancar(entrega.id);
  assert.equal(emTransito.status, "EM_TRANSITO");

  await assert.rejects(entregasService.atribuirMotorista(entrega.id, motorista.id), (e) => e.statusCode === 422);

  const entregue = await entregasService.avancar(entrega.id);
  assert.equal(entregue.status, "ENTREGUE");

  const entregasDoMotorista = await motoristasService.entregasDoMotorista(motorista.id);
  assert.equal(entregasDoMotorista.length, 1);
  assert.equal(entregasDoMotorista[0].id, entrega.id);

  const semResultado = await motoristasService.entregasDoMotorista(motorista.id, "CRIADA");
  assert.equal(semResultado.length, 0);

  await assert.rejects(motoristasService.buscarPorId(999), (e) => e.statusCode === 404);
  await assert.rejects(entregasService.buscarPorId(999), (e) => e.statusCode === 404);

  console.log("OK: services funcionam normalmente com repositories Mock (contrato respeitado)");
}

main().catch((erro) => {
  console.error("FALHOU: service depende de algo fora do contrato?");
  console.error(erro);
  process.exit(1);
});
