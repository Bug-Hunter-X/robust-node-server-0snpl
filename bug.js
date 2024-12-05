const http = require('http');

const requestListener = (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  response.end(JSON.stringify({ message: 'Hello, World!' }));
};

const server = http.createServer(requestListener);

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

//Uncommon Bug: Inconsistent handling of request data

//Scenario: the server might fail to handle large requests or requests with unusual characteristics properly.

//Problem:  This code doesn't handle scenarios such as:
//1. Very large request bodies.
//2. Unexpected request headers (leading to potential vulnerabilities). 
//3. Malformed JSON in request body.
//4. Handling errors during request processing and responding appropriately.

//The server is vulnerable to denial-of-service attacks or unexpected behavior.
