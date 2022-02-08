# Nodejs-Cloud-Run

Deploy Nodejs Api's in GCP Infrastructure with the help of Cloud Run Deployment

[Kubernetes tutorial: basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
PROJECT ID=jocam-microservices-test

## Steps

1. Enable Kubernetes Engine in your Google Cloud project
1. Type `gcloud auth list` to get list of users to use
1. Type `gcloud init` to configure user/project/timezone
1. Change region with `gcloud config set compute/zone NAME`
1. Type `gcloud config list` to show config list
1. Type `gcloud auth configure-docker` to allow gcloud to use docker


## Dockering your project

1. BUILD Image: type `docker build -t dummy-node:1.0.0 .`
1. EXECUTE IMAGE: type `docker run -p 8888:8 -t dummy-node:1.0.0`
1. Check if it is up and running (and get `CONTAINER_ID`): `docker ps`
1. Stop container: `docker stop CONTAINER_ID`
1. Tag: `docker tag dummy-node:1.0.0 eu.gcr.io/jocam-microservices-test/dummy-node:1.0.0`
1. PUSH: `docker push eu.gcr.io/jocam-microservices-test/dummy-node:1.0.0`

## Kubernetes cluster

1. Create it with: `gcloud container clusters create test --num-nodes 2 --machine-type g1-small --zone europe-west3`
1. Getting info: `kubectl cluster-info`
    Note: change nodes of cluster: `gcloud container clusters resize test --node-pool default-pool --num-nodes 2`
1. View nodes: `kubectl get nodes`
1. Add a deploy config: `kubectl create deployment test1 --image=eu.gcr.io/jocam-microservices-test/dummy-node:1.0.0`
1. Getting list of deployment configs: `kubectl get deployments`
1. Getting pods: `kubectl get pods`
1. List of kubectl actions at [kubernetes.io/docs/reference/kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
1. Getting logs from a pod:
    1. Grab the pod id from `kubectl get pods`
    1. Type `kubectl logs PODNAME`
1. [Exposing the app by creating a service](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/): `kubectl expose deployment test1 --type="LoadBalancer" --port=8888`
1. Getting public IP:
    1. List services: `kubectl get services` or `kubectl get service -o wide`
    1. `kubectl describe services/test1`

Note: you can delete a service with kubectl `delete svc SERVICE_NAME`

## Scaling

1. `kubectl scale deployment test1 --replicas=2`
1. Check it with: 
    1. `kubectl get deployment`
    1. `kubectl get pods`
    1. `kubectl describe pods | less`

## Deploying new version

### Generate new ver

1. `docker build -t dummy-node:1.0.1 .`
1. `docker tag dummy-node:1.0.0 eu.gcr.io/jocam-microservices-test/dummy-node:1.0.1`
1. `docker push eu.gcr.io/jocam-microservices-test/dummy-node:1.0.1`

### Rolling up

1. `kubectl set image deployments/test1 dummy-node=eu.gcr.io/jocam-microservices-test/dummy-node:1.0.1`
1. check with:
    1. `kubectl rollout status deployments/test1`
    1. `kubectl describe pods`

## Rollout

1. to the latest working version: `kubectl rollout undo deploymejnts/test1`

## Redis

### Configmap

[Kubernetes, pods and configmaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)

1. `kubectl apply -f redis-configmap.yaml`
1. `kubectl apply -f redis-pod.yaml`
1. checking it with `kubectl get pod/redis configmap/redis-configmap`
1. entering in redis: `kubectl exec -it redis -- redis-cli`

### How to update the config map

1. change some values at redis-configmap.yaml
1. type `kubectl apply -f redis-configmap.yaml`
1. confirm it with `kubectl describe configmap/redis-configmap`
1. restart redis pod with:
    1. `kubectl delete pod redis`
    1. `kubectl apply -f redis-pod.yaml`

## Other

1.Execute command in a pod:
    1. get the pod name with `kubectl describe pods`
    1. run `kubectl exec PODNAME -- COMMAND` for example: `kubectl exec test1-57f8bc5545-gkzmf -- env`

## Create task

1. `gcloud tasks queues create microservices-task --location europe-west3`
1. Let's check the existing list of queues `gcloud tasks queues list --location=europe-west3`
1. Let's check it with `gcloud tasks queues describe microservices-task --location=europe-west3`

## Create Redis

1.`gcloud redis instances create example-redis --size=5 --region=europe-west3`
1.list of instances `gcloud redis instances list --region=europe-west3`
1.check particular instace with: `gcloud redis instances describe example-redis --region=europe-west3`
