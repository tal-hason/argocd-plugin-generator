const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArgoCD Plug-in Generator App',
      version: '1.0.0',
      description: 'The Generator POST Tester',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Specify the format of your token (e.g., JWT)
        },
      },
    },
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
