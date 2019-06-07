const path = require('path');

const hwp = require('html-webpack-plugin');

const SRC_DIR = path.join(__dirname, '/src/');
const DIST_DIR = path.join(__dirname, '/dist/');

module.exports = {
  entry: path.join(SRC_DIR + 'index.js'),
  output: {
    filename: 'build.js',
    path: DIST_DIR,
    globalObject: 'this'
  },
  module:{
    rules:[{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    }]
  },
  plugins:[
    new hwp({template: SRC_DIR + 'index.html'})
  ]
}