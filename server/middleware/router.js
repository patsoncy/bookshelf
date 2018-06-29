const fs = require('fs');
const path = require('path');
const pathToRegexp = require('path-to-regexp');

module.exports = (options) => {

  let routes = fs.readFileSync(options.routes, 'utf8')
    .split(/\r|\n/)
    .filter((line) => {
      return line && !/^[;|#|/]/g.test(line);
    }).map((line) => {
      let parts = String(line).trim().split(/\s+/);
      if (parts.length == 4) {
        let module = parts[ 3 ].split('#');
        return {
          method: parts[ 0 ],
          path: parts[ 1 ],
          file: module[ 0 ],
          name: module[ 1 ]
        };
      }
    });
  routes = routes.map((route) => {
    let file = path.join(options.controllers, route.file);
    try {
      let keys = [];
      route.func = require(file)[ route.name ];
      route.regexp = pathToRegexp(route.path, keys);
      route.keys = keys;
      return route;
    } catch (e) {
      console.error('can not resolve %s', file, e.stack);
    }
  });

  function matches(ctx, method) {
    if (!method) { return true; }
    if (ctx.method.toUpperCase() === method.toUpperCase()) { return true; }
    if (method === 'GET' && ctx.method === 'HEAD') { return true; }
    return false;
  }

  return async function(ctx, next) {
    let route = routes.filter((r) => {
      if (!matches(ctx, r.method)) return false;
      if (r.regexp.test(ctx.path)) return true;
    });
    if (route && route.length && typeof route[ 0 ].func === 'function') {
      ctx.params = {};
      let matchs = route[ 0 ].regexp.exec(ctx.path).slice(1);
      route[ 0 ].keys.forEach((key, index) => {
        ctx.params[ key.name ] = matchs[ index ];
      });
      await route[ 0 ].func.apply(ctx);
    } else {
      await next();
    }
  };
};
