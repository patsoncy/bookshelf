const fs = require('fs');
const https = require('https');
const app = require('./server/app');
const config = require('kelp-config');

if(process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync('./ssl/selfsigned/server.key'),
    cert: fs.readFileSync('./ssl/selfsigned/server.crt')
  };
  https.createServer(options, app.callback()).listen(config.serve.port, () => {
    console.log('https server started');
  });
}

if(process.env.NODE_ENV !== 'development') {
  app.listen(config.serve.port, () => {
    console.log('http server started');
  });
}

process.on('uncaughtException', (err) => {
  console.log('uncaughtException found:');
  console.error(err);
});