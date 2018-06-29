const fs = require('fs');
const path = require('path');

class HashedFilenameWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign({} , {
      env: process.env.NODE_ENV
    }, options);
  }

  apply(compiler) {
    compiler.hooks.done.tap('HashedFilenameWebpackPlugin', (stats) => {

      const buildStats = stats.toJson();
      const { assetsByChunkName = {} } = buildStats;
      const chunkNames = {};

      for (const name in assetsByChunkName) {
        chunkNames[ `${name}js` ] = [].concat(assetsByChunkName[ name ]).find(f => /^js\/.*\.js$/g.test(f));
        chunkNames[ `${name}css` ] = [].concat(assetsByChunkName[ name ]).find(f => /^css\/.*\.css$/g.test(f));
      }

      const hashes = JSON.stringify(chunkNames);
      fs.writeFileSync(
        path.join(__dirname, '../.hash.json'), hashes);
      console.log('hash.json:', hashes);
    });
  }
}

module.exports = HashedFilenameWebpackPlugin;