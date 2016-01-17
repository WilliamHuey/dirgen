var path = require('path');

module.exports = {
  entry: './src/dirgen.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'dirgen.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [path.join(__dirname, '/src')],
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    extensions: ['', '.config.js', '.js']
  },
  target: 'node'
};