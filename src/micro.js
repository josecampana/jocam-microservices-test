const { PORT: port = 3000, ADDRESS: address = '0.0.0.0' } = process.env;

const fastify = require('fastify')({
  logger: true,
});

const helmet = require('fastify-helmet');
fastify.register(helmet);

fastify.register(require('fastify-cors'), (_instance) => {
  return (req, callback) => {
    let corsOptions;
    const origin = req.headers.origin;

    // do not include CORS headers for requests from localhost
    if (/localhost/.test(origin)) {
      corsOptions = { origin: false };
    } else {
      corsOptions = { origin: true };
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };
});

fastify.register(require('./routes'));

fastify.listen(port, address, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`listening on ${address}`);
});
