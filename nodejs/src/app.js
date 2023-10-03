const http = require('http');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const util = require('util'); // Import the util module

const token = fs.readFileSync('/var/run/argo/token', 'utf-8').trim();

// Define a function to load configurations from the 'config' folder
function loadConfigurations() {
  const configFolder = path.join(__dirname, 'config'); // Path to the 'config' folder
  const configFiles = fs.readdirSync(configFolder);

  const configurations = [];

  configFiles.forEach((file) => {
    if (file.endsWith('.yaml')) {
      const filePath = path.join(configFolder, file);
      const configYAML = fs.readFileSync(filePath, 'utf-8');
      const config = yaml.load(configYAML); // Use yaml.load instead of yaml.safeLoad
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

const server = http.createServer((req, res) => {
  if (req.headers.authorization !== `Bearer ${token}`) {
    console.log('Unauthorized request');
    forbidden(res);
    return;
  }

  if (req.url === '/api/v1/getparams.execute' && req.method === 'POST') {
    console.log('Received POST request for /api/v1/getparams.execute');
    // Read and print the POST request body
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      console.log('POST request body:');
      console.log(requestBody);

      // Use the first configuration loaded from the 'config' folder
      if (configurations.length > 0) {
        const apiPayload = configurations[0].apiPayload;

        const response = {
          output: {
            parameters: apiPayload,
          },
        };

        console.log('Sending response for /api/v1/getparams.execute');
        reply(res, response);
      } else {
        // Handle the case when no configurations are loaded
        console.log('No configurations found');
        reply(res, { error: 'No configurations found' });
      }
    });
  } else if (req.url === '/health/liveliness') {
    console.log('Received GET request for /health/liveliness');
    // Implement the liveliness probe logic here
    livelinessProbe(res);
  } else if (req.url === '/health/readiness') {
    console.log('Received GET request for /health/readiness');
    // Implement the readiness probe logic here
    readinessProbe(res);
  } else {
    console.log('Received request for an unsupported path:', req.url);
    unsupported(res);
  }
});

function reply(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function forbidden(res) {
  res.writeHead(403);
  res.end('Forbidden');
}

function unsupported(res) {
  res.writeHead(404);
  res.end('Not Found');
}

function livelinessProbe(res) {
  // Implement the liveliness probe logic here
  // For example, you can check if a critical component is running
  console.log('Liveliness probe successful');
  res.writeHead(200);
  res.end('Liveliness: OK');
}

function readinessProbe(res) {
  // Implement the readiness probe logic here
  // For example, you can check if your application is ready to serve requests
  console.log('Readiness probe successful');
  res.writeHead(200);
  res.end('Readiness: OK');
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
