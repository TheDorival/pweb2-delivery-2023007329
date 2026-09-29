/**
 * @typedef {Object} EventoHistorico
 * @property {string} data
 * @property {string} descricao
 */

/**
 * @typedef {'CRIADA'|'EM_TRANSITO'|'ENTREGUE'|'CANCELADA'} StatusEntrega 
 */

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {StatusEntrega} status
 * @property {number|null} motoristaId
 * @property {EventoHistorico[]} historico 
 */

/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string} [placaVeiculo]
 * @property {StatusMotorista} status
 */

/**
 * @typedef {Object} FiltrosEntrega
 * @property {StatusEntrega} [status]
 * @property {number} [motoristaId]
 */


/**
 * contrato de persitencia de entregas
 * @interface IEntregasRepository
 */

/**
 * @function
 * @name IEntregasRepository#listarTodos
 * @param {FiltrosEntrega} [filtros]
 * @returns {Entrega[]}
 */

/**
 * @function
 * @name IEntregasRepository#buscarPorId
 * @param {Omit<Entrega, 'id'>} dados
 * @returns {Entrega|null}
 */

/**
 * @function
 * @name IEntregasRepository#criar
 * @param {Omit<Entrega, 'id'>}
 * @returns {Entrega}
 */

/**
 * @function
 * @name IEntregasRepository#atualizar
 * @param {number} id
 * @param {Partial<Entrega>} dados
 * @returns {Entrega}
 */


/**
 * contrato de persistencia de motoristas
 * @interface IMotoristasRepository
 */


/**
 * @function
 * @name IMotoristasRepository#listarTodos
 * @returns {Motorista[]}
 */

/**
 * @function
 * @name IMotoristasRepository#buscarPorId
 * @param {number} id
 * @returns {Motorista|null}
 */

/**
 * @function
 * @name IMotoristasRepository#buscarPorCpf
 * @param {string} cpf
 * @returns {Motorista|null}
 */

/**
 * @function
 * @name IMotoristasRepository#criar
 * @param {Omit<Motorista, 'id'>} dados
 * @returns {Motorista}
 */

export { };