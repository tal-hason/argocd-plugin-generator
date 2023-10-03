# ArgoCD Plugin Generator example

![Argo](staticFiles/Argo-CD.png)

[ArgoCD Plugin Generator Operator Page](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators-Plugin/)

---

## What we have here

**Lets explian nodeJS folder

under it we have:

- src folder, with the app.js file that contains our web-application server
- src/config, here we store a default app.yaml file with basic config
- argocd-plugin-app.postman_collection.json, Postman Colletion to assit with testing the POST request.
- automation.sh, script to assist with build, test and push the application image.
- Dockerfile, Multi-stage Docker file to build the applicaion container image.

** automation.sh file will make the working of running podman build/run/push more easy

The script accepts 2 running arguments the 1st is the commit message, the 2nd is the desired opertaion

- test, this will build and run the application image
- push, this will build and push the application image to the image registry, after it prompt to either update the HELM chart values file or not, with the new image tag.
    to work with the file create an enviorment variable named IMAGE_NAME with your _image.registry/repo_name/image_, if you forgot the script will ask you for the image name in the first run.

