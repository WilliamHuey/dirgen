//Native modules
import path from 'path';

//Vendor modules
import webpack from 'webpack';

//Source modules
import { localPath, localPathJoin } from './webpack.helpers.babel';

module.exports = {
  entry: {
    "dirgen-cli-entry": [
      'regenerator-runtime/runtime',
      localPath("/src/dirgen-cli-entry.js")
  ]},
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.md/,
        loader: 'raw-loader'
      },
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: localPathJoin(["node_modules", "tests", "bin"]),
        loader: ["eslint-loader"]
      },
      {
        test: /\.js$/,
        exclude: localPathJoin(["node_modules", "tests"]),
        loader: ["babel-loader?cacheDirectory=true"],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  output: {
    path: localPath('/bin/'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  plugins: [
  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        configFile: './.eslintrc'
      }
    }
  })
],
  performance: false,
  target: 'node'
};
