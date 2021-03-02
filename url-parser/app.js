const http = require('http');
const { URL } = require('url');

const parser = require('./src/parser')
const util = require('./src/util')

const hostname = '127.0.0.1';
const port = 3000;
const baseUrl = 'http://' + hostname + ':' + port

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  var url = baseUrl + req.url;
  var parsedUrl = new URL(url);

  var nextUrl = parsedUrl.searchParams.get('nextUrl');

  //1. canonicalization
  //2. sanitize
  //3. validate

  // res.write("Demoing URL: " + parser.handleRelativeUrl());
  // res.write("Demoing URL: " + parser.constructUrl());

  if(nextUrl != null){
    console.log('\nURL Requested')
    console.log("Raw url: "+req.url)
    console.log("Parsed nextUrl parameter: " + nextUrl);

    redirectLocation = "/" + nextUrl;
    res = util.setLocationHeader(res, redirectLocation);
  }

  res.write("Done!");
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});