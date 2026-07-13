// swagger
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'AutoLease API',
    description: 'Production-ready Car Rental & Marketplace API',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your Bearer token in the format **Bearer &lt;token&gt;**',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./src/server.ts']; // We point it to the main entry file

// Generate swagger.json
swaggerAutogen(outputFile, routes, doc);