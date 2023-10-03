const swaggerJsdoc = require('swagger-jsdoc');

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Your API Documentation', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API documentation for your Node.js application',
    },
  },
  // API paths to be documented
  apis: ['./*.js'], // Replace with the path to your route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
