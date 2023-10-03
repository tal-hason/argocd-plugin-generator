#!/bin/bash

# Check if at least two arguments are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 <commit_message> <action>"
  exit 1
fi

commit_message="$1"
action="$2"

# Commit the changes with the provided commit message
git add -A
git commit -m "$commit_message"

# Get the latest commit short SHA and save it in an environment variable
BUILD_TAG=$(git rev-parse --short HEAD)

# Build the container image and tag it with the BUILD_TAG
podman build . -t quay.io/thason/argocd-appset-plugin:$BUILD_TAG

if [ "$action" == "test" ]; then
  # Run the container for testing
  podman run -it -p 8080:8080 quay.io/thason/argocd-appset-plugin:$BUILD_TAG &
  echo "Container for testing started."

  # Print the container log
  container_id=$(podman ps -lq)
  if [ -z "$container_id" ]; then
    echo "Container not found or failed to start."
    exit 1
  fi

  echo "Container ID: $container_id"
  echo "Container Log:"
  podman logs -f $container_id

elif [ "$action" == "push" ]; then
  # Push the container image to the repository
  podman push quay.io/thason/argocd-appset-plugin:$BUILD_TAG
  echo "Container image pushed to repository."

else
  echo "Invalid action. Use 'test' or 'push'."
  exit 1
fi
