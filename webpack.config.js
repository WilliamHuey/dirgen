var path = require('path');

module.exports = {
  entry: {
    "dirgen-cli-entry": path.join(__dirname, "/src/dirgen-cli-entry.js")
  },
  output: {
    path: path.join(__dirname, '/bin/'),
    filename: '[name].js',
    library: 'dirgen',
    libraryTarget: 'commonjs'
  },
  module: {
    exprContextCritical: false,
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],
    loaders: [{
      test: /\.js$/,
      include: [
        path.join(__dirname, '/src')
      ],
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ['es2015']
      }
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
  target: 'node'
};