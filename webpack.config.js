var path = require('path');

module.exports = {
  entry: './src/dirgen.js',
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'dirgen.js'
  },
  module: {
    exprContextCritical: false,
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname, '/src'),
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    extensions: ['', '.config.js', '.js']
  },
  eslint: {
    configFile: './.eslintrc'
  },
  target: 'node'
};