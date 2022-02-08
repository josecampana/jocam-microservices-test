const { CloudTasksClient } = require('@google-cloud/tasks');
const {
  project,
  queue,
  location,
  inSeconds,
  TASK_NAME_PATTERN,
} = require('./config');

const NEW_QUEUE_NAME = `${project}@${location}${queue}`;

const client = new CloudTasksClient();

const createTask = async () => {
  const parent = client.queuePath(project, location, queue);
  const task = {
    httpRequest: {
      httpMethod: 'GET',
      url: 'http://localhost:8888/',
    },
  };

  if (inSeconds) {
    task.scheduleTime = {
      seconds: parseInt(inSeconds) + Date.now() / 1000,
    };
  }

  const request = { parent, task };
  const [response] = await client.createTask(request);
  const taskId = response.name.replace(TASK_NAME_PATTERN, '');

  return { id: taskId, queue: NEW_QUEUE_NAME };
};

const createQueue = async () => {
  const parent = client.locationPath(project, location);
  const request = {
    parent,
    queue: {
      name: client.queuePath(project, location, queue),
    },
  };

  try {
    const [response] = await client.createQueue(request);
    const { name: queueName, rateLimits, retryConfig, state } = response;
    console.log(`queue ${queueName} ${state}`);
    console.debug(`rateLimits ${JSON.stringify(rateLimits)}`);
    console.debug(`retryConfig ${JSON.stringify(retryConfig)}`);
  } catch (error) {
    if (error.code !== 6) {
      console.fatal(error);
    } else {
      console.warn(`[${queue}] already exist at ${project}@${location}`);
    }
  }
};

createQueue().then(async () => {
  const res = await createTask();
  console.log(`created ${JSON.stringify(res)}`);
});
