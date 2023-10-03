FROM registry.access.redhat.com/ubi9/nodejs-18

# Create app directory
WORKDIR /tmp

USER root
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package*.json ./


# update the base image
RUN npm install && npm audit fix --force && \
    mkdir -p /var/run/argo/ && \
    echo 12345678 > /var/run/argo/token
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY src .

USER 1001

EXPOSE 8080
CMD [ "node", "app.js" ]