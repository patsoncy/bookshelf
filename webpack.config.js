const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashedFilenameWebpackPlugin = require('./lib/hashedFilenameWebpackPlugin');

module.exports = {
  mode: 'development',
  entry: {
    vendor: './client/vendor.js',
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/main.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: [
          path.resolve(__dirname, 'client')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'vue-loader'
      }, {
        test: /\.(le|c)ss$/,
        use: [
          // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
          // MiniCssExtractPlugin 暂时还不支持 HMR, 开发时依然用 style-loader 替代
          'vue-style-loader',
          // 发现支持 css HMR 的 loader https://github.com/shepherdwind/css-hot-loader
          // 'css-hot-reload', 对 vue 不友好，有待研究
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192&name=/img/[name].[ext]'
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?limit=10000&mimetype=image/svg+xml&name=/img/[name].[ext]'
      }
    ]
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['.js', '.json', '.vue'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'client'),
    ]
  },
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: 'css/style.css',
    //   chunkFilename: 'css/[id].css'
    // }),
    new VueLoaderPlugin(),
    new HashedFilenameWebpackPlugin()
  ]
};