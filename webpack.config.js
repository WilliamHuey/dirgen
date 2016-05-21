var path = require('path');

module.exports = {
  entry: {
    "dirgen-cli-entry": path.join(__dirname, "/src/dirgen-cli-entry.js")
    // dirgen: ["./src/dirgen.js"]
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