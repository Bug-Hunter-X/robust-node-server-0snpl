const http = require('http');
const fs = require('fs'); //For handling large files

const requestListener = async (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  //Check request method
  if (request.method !== 'POST') {
    response.writeHead(405, {'Content-Type': 'text/plain'});
    response.end('Method Not Allowed');
    return;
  }

  //Check Content-Length header
  const contentLength = request.headers['content-length'];
  if (!contentLength || parseInt(contentLength) > 1024 * 1024) { //1MB limit
    response.writeHead(413, {'Content-Type': 'text/plain'});
    response.end('Request Entity Too Large');
    return;
  }

  let body = '';
  request.on('data', chunk => {
    body += chunk;
  });

  request.on('end', async () => {
    try {
      const data = JSON.parse(body);
      //Process the validated data
      response.writeHead(200);
      response.end(JSON.stringify({ message: 'Request processed successfully', data }));
    } catch (error) {
      console.error('Error processing request:', error);
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({ error: 'Invalid request data' }));
    }
  });

  request.on('error', (err) => {
      console.error('Request error:', err);
      response.writeHead(500, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
  })
};

const server = http.createServer(requestListener);

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

//Solution: Addresses the issue by adding input validation and comprehensive error handling.
//1. Limits request body size to prevent large request attacks.
//2. Uses JSON.parse with error handling to prevent crashes from malformed JSON.
//3. Handles errors from request object and responds gracefully to the client.