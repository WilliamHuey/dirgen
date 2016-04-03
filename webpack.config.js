var path = require('path');

module.exports = {
  entry: {
    dirgen: "./src/dirgen.js"
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js'
  },
  module: {
    exprContextCritical: false,
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname, '/src'),
      exclude: /node_modules/,
      loader: "babel-loader"
    },{
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    extensions: ['', '.config.js', '.js']
  },
  eslint: {
    configFile: './.eslintrc.json'
  },
  babel: {
    presets: ['es2015', 'stage-3']
  },
  target: 'node'
};