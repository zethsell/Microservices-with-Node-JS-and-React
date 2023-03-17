kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
k create secret generic jwt-secret --from-literal=jwt=asdf
k create secret generic jwt --from-literal=JWT_KEY=asdf
