const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Meta API',
    description: 'meta api doc',
  },
  host: 'localhost:3001',
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'authorization',
      description: 'JWT Token'
    }
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);