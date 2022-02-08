/* eslint-disable global-require */
module.exports = async (fastify, _options) => {
  fastify.get('/', async (_req, _res) => ({
    fistro: true,
  }));

  fastify.get('/:service', async (req, _res) => {
    const { service } = req.params || {};

    return { service };
  });

  fastify.put(
    '/transaction',
    { ...require('./schema/transaction'), logLevel: 'debug' },
    async (req, res) => {
      const { body } = req;
      const { log } = res;

      log.debug(body);

      res.code(201);
      return { transaction_id: 8 };
    }
  );
};
