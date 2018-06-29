const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HashedFilenameWebpackPlugin = require('./lib/hashedFilenameWebpackPlugin');

module.exports = {
  mode: 'production',
  entry: {
    vendor: './client/vendor',
    app: './client/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash:8].js',
    publicPath: 'dist',
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
          MiniCssExtractPlugin.loader,
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
  devtool: 'source-map',
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
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
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
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    }),
    new VueLoaderPlugin(),
    new HashedFilenameWebpackPlugin()
  ]
};