const fs = require('fs');
const app = require('./server/app');
const https = require('https');

const options = {
  key: fs.readFileSync('./ssl/selfsigned/server.key'),
  cert: fs.readFileSync('./ssl/selfsigned/server.crt')
};

app.listen(3001);

https.createServer(options, app.callback()).listen(3000, () => {
  console.log('server started');
});

process.on('uncaughtException', (err) => {
  console.log('uncaughtException found:');
  console.error(err);
});