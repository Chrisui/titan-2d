var webpack = require('webpack');
var pkg = require('./package.json');

var libDir = __dirname + '/lib';
var projectVar = pkg.globalExport;
var ENV = process.env.NODE_ENV;
var COMPRESS = process.env.COMPRESS;

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV),
    '__VER__': pkg.version
  })
];

if (COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    })
  );
}

module.exports = {
  entry: './lib/index',
  output: {
    library: projectVar,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel-loader']}]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    root: [libDir],
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules']
  },
  plugins: plugins
};
