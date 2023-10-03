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
  # Run the container for testing with a name 'argocd-plugin'
  podman run -it -p 8080:8080 --name=argocd-plugin quay.io/thason/argocd-appset-plugin:$BUILD_TAG &
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

  # Ask the user if they want to update the Helm values file
  read -p "Do you want to update the Helm values file (values.yaml)? (y/n): " update_values
  if [ "$update_values" == "y" ]; then
    # Use yq to update the tag in the Helm values file
    yq e -i ".image.tag = \"$BUILD_TAG\"" ../GitOps/Application/values.yaml

    # Commit and push the updated Helm values file
    git add GitOps/Application/values.yaml
    git commit -m "Update container image tag in Helm values file to $BUILD_TAG"
    git push
    echo "Helm values file updated and pushed to the Git repository."
  fi

else
  echo "Invalid action. Use 'test' or 'push'."
  exit 1
fi
