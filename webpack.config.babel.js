import path from 'path';
import webpack from 'webpack';

module.exports = {
  entry: {
    "dirgen-cli-entry": [
      'regenerator-runtime/runtime',
      path.join(__dirname, "/src/dirgen-cli-entry.js")]
  },
  module: {
    exprContextCritical: false,
    rules: [
      // {
      //   test: /\.js$/,
      //   enforce: "pre",
      //   exclude: [
      //     path.join(__dirname, "/node_modules/")
      //   ],
      //   loader: "eslint-loader"
      // },
      {
        test: /\.js$/,
        exclude: [
          path.join(__dirname, "/node_modules/")
        ],
        loader: "babel-loader"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  output: {
    path: path.join(__dirname, '/bin/'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  // loaders: [
  //   "babel-loader",
  //   "json-loader"
  // ],
  plugins: [
  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        configFile: './.eslintrc'
      }
    }
  })
],
  target: 'node'
};
