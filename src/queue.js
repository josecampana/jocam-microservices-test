const { CloudTasksClient } = require("@google-cloud/tasks");
const client = new CloudTasksClient();

const {
  GCLOUD_PROJECT_ID: project = "jocam-microservices-test",
  // GCLOUD_TASK_NAME: queue = "example-queue",
  GCLOUD_TASK_LOCATION: location = "europe-west3",
  // GCLOUD_TASK_RETRY_SECONDS: inSeconds,
} = process.env;

const QUEUE_NAME = `projects/${project}/locations/${location}/queues/`;
const UNKNOWN_STATE = "UNKNOWN";

const getQueues = async ({ extended } = {}) => {
  const parent = client.locationPath(project, location);
  const [queues] = await client.listQueues({ parent });

  if (!queues.length) {
    console.log(`no queues found`);

    return [];
  } else {
    return await Promise.all(
      queues.map(async (queue) => {
        const name = queue.name.replace(QUEUE_NAME, "");
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
                id: name.replace(TASK_ID_ORIGINAL, ""),
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
  }
};

// listQueues();
getQueues({ extended: true }).then((res) => {
  console.log(JSON.stringify(res, null, 2));
});
