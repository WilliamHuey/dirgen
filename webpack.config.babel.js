import path from 'path';

module.exports = {
  entry: {
    "dirgen-cli-entry": [
      'regenerator-runtime/runtime',
      path.join(__dirname, "/src/dirgen-cli-entry.js")]
  },
  module: {
    exprContextCritical: false,
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel!eslint'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  output: {
    path: path.join(__dirname, '/bin/'),
    filename: '[name].js',
    library: 'generate',
    libraryTarget: 'commonjs'
  },
  eslint: {
    configFile: './.eslintrc'
  },
  target: 'node'
};
