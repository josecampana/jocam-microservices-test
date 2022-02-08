const {
  GCLOUD_PROJECT_ID: project = 'jocam-microservices-test',
  GCLOUD_TASK_NAME: queue = 'example-queue',
  GCLOUD_TASK_LOCATION: location = 'europe-west3',
  GCLOUD_TASK_RETRY_SECONDS: inSeconds,
} = process.env;

const QUEUE_NAME_PATTERN = `projects/${project}/locations/${location}/queues/`;
const TASK_NAME_PATTERN = `projects/${project}/locations/${location}/queues/${queue}/tasks/`;

module.exports = {
  project,
  location,
  queue,
  inSeconds,
  QUEUE_NAME_PATTERN,
  TASK_NAME_PATTERN,
};
