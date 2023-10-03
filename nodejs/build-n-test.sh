#!/bin/bash

# Check if the commit message is provided as an argument
if [ $# -eq 0 ]; then
  echo "Usage: $0 <commit_message>"
  exit 1
fi

# Commit the changes with the provided commit message
commit_message="$1"
git add -A
git commit -m "$commit_message"

# Get the latest commit short SHA and save it in an environment variable
BUILD_TAG=$(git rev-parse --short HEAD)

# Build the container image and tag it with the BUILD_TAG
podman build . -t quay.io/thason/argocd-appset-plugin:$BUILD_TAG

# Run the container
podman run -it -p 8080:8080 quay.io/thason/argocd-appset-plugin:$BUILD_TAG &

# Print the container log
container_id=$(podman ps -lq)
if [ -z "$container_id" ]; then
  echo "Container not found or failed to start."
  exit 1
fi

echo "Container ID: $container_id"
echo "Container Log:"
podman logs -f $container_id
