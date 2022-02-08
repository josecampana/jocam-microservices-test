/* eslint-disable global-require */
module.exports = {
  schema: {
    body: require('./body/transaction.json'),
    response: require('./response/transaction.json'),
  },
};
