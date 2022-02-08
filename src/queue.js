const { CloudTasksClient } = require('@google-cloud/tasks');
const client = new CloudTasksClient();

const { project, location, QUEUE_NAME_PATTERN } = require('./config');

const UNKNOWN_STATE = 'UNKNOWN';

const getQueues = async ({ extended } = {}) => {
  const parent = client.locationPath(project, location);
  const [queues] = await client.listQueues({ parent });

  if (!queues.length) {
    console.log('no queues found');

    return [];
  }
  return Promise.all(
    queues.map(async (queue) => {
      const name = queue.name.replace(QUEUE_NAME_PATTERN, '');
      const { state = UNKNOWN_STATE } = queue;
      const request = {
        parent: client.queuePath(project, location, name),
      };

      let tasks;
      let tasksCount = 0;

      try {
        const TASK_ID_ORIGINAL = `projects/${project}/locations/${location}/queues/${name}/tasks/`;
        const [taskList = []] = await client.listTasks(request);

        tasksCount = taskList.length;

        if (extended) {
          tasks = taskList.map(
            ({
              name,
              dispatchCount: retries,
              createTime,
              httpRequest: req,
            }) => ({
              id: name.replace(TASK_ID_ORIGINAL, ''),
              name,
              retries,
              created: new Date(createTime.seconds * 1000).toISOString(),
              request: `${req.httpMethod} ${req.url}`,
            })
          );
        }
      } catch (error) {
        console.error(error);
      }

      return { name, state, location, project, tasksCount, tasks };
    })
  );
};

// listQueues();
getQueues({ extended: true }).then((res) => {
  console.log(JSON.stringify(res, null, 2));
});
