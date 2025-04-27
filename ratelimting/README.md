# scalablity-mini-setup

Deployment manages the lifecycle of Pods, ensuring that the right number of replicas are running and handles updates.

Service provides a stable access point to communicate with Pods, abstracting away the complexity of the underlying pod IPs.

The Deployment ensures that your application is running the specified number of pods.

The Service ensures that there is a stable endpoint for other components (such as other microservices or clients) to access the app, even if the actual pod instances are replaced or scaled up/down.

cmds:

1. kubectl get pods -o wide

2. kubectl logs deploy/haproxy-ingress

3. kubectl get deployments/pods/svc/ns/nodes/ingress/ingressclass

4. kubectl apply -f filename.yaml

5. kubectl delete deployment/pod/service/namespace/ingress/node

6. kubectl create

7. helm repo list

8. helm search repo haproxy

9. kubectl delete validatingwebhookconfigurations ingress-nginx-admission
   10.kubectl describe
   doubts:
   minikube tunnel -local test - minikube ip not reflected in ingress rule address shows only - only helm install map is working that also map 127.0.0.1 - if not minikube real world
   -> ingress rule defined host convert dns ip path convert to do

Step | What Happens
1 | Deploy HAProxy Ingress or NGINX Ingress
2 | Create an Ingress rule like host: example.com, path: /api
3 | Kubernetes cloud provider (AWS/GCP/Azure) creates a LoadBalancer
4 | LoadBalancer gets a public IP, say 34.123.22.55
5 | Update your public DNS (GoDaddy, Cloudflare, etc) example.com -> 34.123.22.55
6 | Now curl http://example.com/api works normally — real DNS resolves.

fuck it up - 27-04-25 by ingress
