const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const Koa = require('koa');
const serve = require('koa-static');
const body = require('koa-body');
const config = require('kelp-config');
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
const { loge } = require('./lib/utils');
const hashjson = require('../.hash.json');


const webpackConfig = require('../webpack.config.js');
const router = require('./middleware/router');

const complie = webpack(webpackConfig);
const app = new Koa();

const isDevMode = process.env.NODE_ENV === 'development';

const template = fs.readFileSync(__dirname + '/views/index.html', { encoding: 'utf8' });

if(isDevMode){
  app.use(devMiddleware(complie, {
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(hotMiddleware(complie));
}

app.use(body());
app.use(serve(path.join(__dirname, '../dist'), {
  maxage: isDevMode ? 0 : 3600000
}));

app.use(router({
  routes: config.path.routes,
  controllers: config.path.controllers
}));


app.use(async ctx => {
  ctx.type = 'text/html; charset=utf-8';
  let body = _.template(template)({
    appjs: hashjson[ 'appjs' ],
    vendorjs: hashjson[ 'vendorjs' ],
    appcss: hashjson[ 'appcss' ],
  });
  ctx.body = body;
});

app.use(async ctx => {
  ctx.type = 'text/html; charset=utf-8';
  let body = _.template(template)({
    appjs: hashjson[ 'appjs' ],
    vendorjs: hashjson[ 'vendorjs' ],
    appcss: hashjson[ 'appcss' ],
  });
  ctx.body = body;
});

app.use(async (ctx, next) => {
  try{
    await next();
  }catch(err) {
    ctx.throw(err.status || 500, err.message);
    ctx.app.emit('error', err, this);
  }
});

app.on('error', err => {
  loge('app caught exception:' + err.message);
});


module.exports = app;