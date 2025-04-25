# scalablity-mini-setup

Deployment manages the lifecycle of Pods, ensuring that the right number of replicas are running and handles updates.

Service provides a stable access point to communicate with Pods, abstracting away the complexity of the underlying pod IPs.


The Deployment ensures that your application is running the specified number of pods.

The Service ensures that there is a stable endpoint for other components (such as other microservices or clients) to access the app, even if the actual pod instances are replaced or scaled up/down.