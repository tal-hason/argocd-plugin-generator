const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');
const util = require('util');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSpec = require('./swagger'); // Path to your swagger.js file

const app = express();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Read the token from the file at /var/run/argo/token
const tokenFilePath = '/var/run/argo/token';
let token;

try {
  token = fs.readFileSync(tokenFilePath, 'utf-8').trim();
} catch (err) {
  console.error(`Error reading token from ${tokenFilePath}:`, err);
  process.exit(1); // Exit the application if the token cannot be read
}

// Define a function to load configurations from the 'config' folder
function loadConfigurations() {
  const configFolder = './config'; // Path to the 'config' folder
  const configFiles = fs.readdirSync(configFolder);

  const configurations = [];

  configFiles.forEach((file) => {
    if (file.endsWith('.yaml')) {
      const filePath = `${configFolder}/${file}`;
      const configYAML = fs.readFileSync(filePath, 'utf-8');
      const config = yaml.load(configYAML, { schema: yaml.JSON_SCHEMA }); // Use yaml.load with schema
      configurations.push(config);

      // Print the content of the loaded YAML file with better formatting
      console.log(`Loaded configuration from ${file}:`);
      console.log(util.inspect(config, { depth: null }));
    }
  });

  return configurations;
}

const configurations = loadConfigurations();

// Get the port from the PORT environment variable or default to 8080
const PORT = process.env.PORT || 8080;


/**
 * @swagger
 * /api/v1/getparams.execute:
 *   post:
 *     summary: Shows the Post body Payload
 *     description: Get parameters from the API.
 *     security:
 *       - BearerAuth: [] # Use the security definition name you define below
 *     requestBody:
 *       required: false
 *     responses:
 *       '200':
 *         description: Successful response
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal Server Error
 * securityDefinitions:
 *   BearerAuth: # Use this name in the security section above
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */
app.post('/api/v1/getparams.execute', (req, res) => {
  console.log('Received POST request for /api/v1/getparams.execute');
  // Read and print the POST request body
  const requestBody = req.body;
  console.log('POST request body:');
  console.log(JSON.stringify(requestBody, null, 2));

  // Check if the request includes the correct token
  if (req.headers.authorization !== `Bearer ${token}`) {
    console.log('Unauthorized request');
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  // Merge configurations from all YAML files in the 'config' folder
  const allConfigurations = [];
  configurations.forEach((config) => {
    if (config.GenerateApplication) {
      if (Array.isArray(config.GenerateApplication)) {
        // If GenerateApplication is an array, push each object separately
        config.GenerateApplication.forEach((appConfig) => {
          allConfigurations.push(appConfig);
        });
      } else {
        // If GenerateApplication is not an array, push it as is
        allConfigurations.push(config.GenerateApplication);
      }
    }
  });

  const response = {
    output: {
      parameters: allConfigurations,
    },
  };

  console.log('Sending response for /api/v1/getparams.execute');
  res.status(200).json(response);
});

// Separate endpoints for liveness and readiness probes
app.get('/health/liveliness', (req, res) => {
  console.log('Received GET request for /health/liveliness');
  // Implement the liveness probe logic here
  // For example, you can check if a critical component is running
  res.status(200).send('Liveliness: OK');
});

app.get('/health/readiness', (req, res) => {
  console.log('Received GET request for /health/readiness');
  // Implement the readiness probe logic here
  // For example, you can check if your application is ready to serve requests
  res.status(200).send('Readiness: OK');
});

// Serve Swagger UI at the /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Respond with a 404 for unsupported paths
app.use((req, res) => {
  console.log('Received request for an unsupported path:', req.url);
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, to access the swagger-UI https://<<Some Route address>>/api-docs`);
});
