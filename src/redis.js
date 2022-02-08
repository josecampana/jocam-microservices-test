const { CloudRedisClient } = require('@google-cloud/redis');
const redis = require('redis');
const IORedis = require('ioredis');
const { project, location } = require('./config');

const redisClient = new CloudRedisClient();

const getInstance = async (name) => {
  const request = {
    parent: redisClient.locationPath(project, location),
    name,
  };

  // Run request
  try {
    const response = await redisClient.getInstance(request);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const list = async () => {
  const { CloudRedisClient } = require('@google-cloud/redis');
  const client = new CloudRedisClient();
  // const formattedParent = client.locationPath(project, location);
  const request = {
    parent: client.locationPath(project, location),
  };
  const [inst = {}] = (await client.listInstances(request))[0];
  const { host, port, name } = inst;

  const intance = await client.getInstance({ name });
  // console.info(resp);

  // const redisCli = new redis.createClient(port, host, { db: 0 });
  const redisCli = new IORedis();
  const keys = await redisCli.get('*');
};

const createInstance = async (name) => {};

const connect = async () => {
  const request = {
    parent: redisClient.locationPath(project, location),
  };

  const resp = (await redisClient.listInstances(request))[0];
  console.info(resp);
};

// connect();
list();
