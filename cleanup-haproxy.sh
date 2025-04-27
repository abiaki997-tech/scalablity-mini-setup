#!/bin/bash

echo "Deleting all HAProxy ingress-related resources..."

# Delete all Ingress resources
kubectl delete ingress --all

# Delete HAProxy Ingress Controller Deployment (if it exists)
kubectl delete deployment haproxy-ingress --ignore-not-found

# Delete HAProxy Ingress Controller Service (if it exists)
kubectl delete service haproxy-ingress --ignore-not-found

# Delete HAProxy ConfigMap (optional, if you had one)
kubectl delete configmap haproxy-ingress --ignore-not-found

# Delete HAProxy-specific namespace (if you had one, adjust name if needed)
# kubectl delete namespace haproxy-controller --ignore-not-found

echo "HAProxy ingress controller and all Ingress rules deleted."

# Optional: delete the ingress class too if you manually created
kubectl delete ingressclass haproxy --ignore-not-found

echo "Cleanup complete ✅"
