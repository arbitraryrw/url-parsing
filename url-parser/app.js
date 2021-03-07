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

  //1. canonicalization - normalise the URL
  //2. sanitization - extract only what is required
  var parsedUrl = new URL(url);
  var nextUrl = parsedUrl.searchParams.get('nextUrl');

  if(nextUrl != null){
    //3. validation - very the URL matches an expected format
    if (!parser.isUrlValid(nextUrl)){
      console.log("Failed validation\n");
      res.write("Failed validation");
      res.end();
      return
    }
  
    console.log('\nURL Requested')
    console.log("Raw url: "+req.url)
    console.log("Parsed nextUrl parameter: " + nextUrl);

    res = util.setLocationHeader(res, nextUrl);
  }

  res.write("Done!");
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});