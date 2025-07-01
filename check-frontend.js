import http from 'http';

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY LENGTH:', data.length);
    console.log('CONTAINS ROOT DIV:', data.includes('<div id="root"></div>'));
    console.log('CONTAINS SCRIPT TAG:', data.includes('<script'));
  });
});

req.on('error', (e) => {
  console.error(`ERROR: ${e.message}`);
});

req.end();