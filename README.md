# ArgoCD Plugin Generator example

![Argo](staticFiles/Argo-CD.png)

[ArgoCD Plugin Generator Operator Page](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators-Plugin/)

---

## What we have here

**Lets explian nodeJS folder**

under it we have:

- src folder, with the app.js file that contains our web-application server
- src/config, here we store a default app.yaml file with basic config
- argocd-plugin-app.postman_collection.json, Postman Colletion to assit with testing the POST request.
- automation.sh, script to assist with build, test and push the application image.
- Dockerfile, Multi-stage Docker file to build the applicaion container image.

**Automation.sh file will make the working of running podman build/run/push more easy**

The script accepts 2 running arguments the 1st is the commit message, the 2nd is the desired opertaion

- test, this will build and run the application image
- push, this will build and push the application image to the image registry, after it prompt to either update the HELM chart values file or not with the new image tag.
    to work with the file create an enviorment variable named IMAGE_NAME with your _image.registry/repo_name/image_, if you forgot the script will ask you for the image name in the first run.

**Dockerfile**

the Docker file build the application based on the _registry.access.redhat.com/ubi9/nodejs-18_ as builder and _registry.access.redhat.com/ubi9/nodejs-18-minimal_ as the final running container.

> During the build it will create a default token for the argocd plugin with _12345678_ as it's value.

**Swagger-UI**

The appliocation expose Swagger-UI at the _/api-docs_ (i.e <https://plugin-argo-plugin-openshift-gitops.apps-crc.testing/api-docs>).
To be able to see the JSON of the Web-Application you need to authorized the Swagger with the Auto-Generated token from the appliaction secret

To Get the secret:

```Bash
oc get secrets argocd-app-set-plugin-token -n openshift-gitops -o yaml | yq eval '.data.token' | base64 -d
```

After you have the Secret Click Authorize Button on the top right of the screen
![Swagger](staticFiles/swagger-auth.png)
