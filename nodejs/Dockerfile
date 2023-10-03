FROM registry.access.redhat.com/ubi9/nodejs-18 as builder

# Create app directory
WORKDIR /tmp

USER root
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package*.json ./


# update the base image
RUN npm install && npm audit fix --force
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

FROM registry.access.redhat.com/ubi9/nodejs-18-minimal

#set Working Dir
WORKDIR /tmp

# create default token
USER root

RUN mkdir -p /var/run/argo/ && \
    echo 12345678 > /var/run/argo/token

USER 1001

COPY --from=builder /tmp . 

COPY src/*.js .
COPY src/config ./config

USER 1001

EXPOSE 8080
CMD [ "node", "app.js" ]