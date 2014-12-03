/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');

module.exports = [{

    output: {
      publicPath: '/assets/',
      path: 'dist/assets/',
      filename: 'main.js'
    },

    debug: false,
    devtool: false,
    entry: './src/scripts/main.jsx',

    stats: {
      colors: true,
      reasons: false
    },

    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ],

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      preLoaders: [{
        test: '\\.js$',
        exclude: 'node_modules',
        loader: 'jshint'
      }],

      loaders: [{
        test: /\.jsx$/,
        loader: 'jsx-loader?harmony'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version'
      }, {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }]
    }
  }, {

  target: "node",
  output: {
    path: "src/scripts",
    filename: "clientSide.js",
    publicPath: '/assets/',
    libraryTarget: "commonjs2"
  },
  externals: /^[a-z\-0-9]+$/,

  debug: false,
  devtool: false,
  entry: './src/scripts/TweetsApp.jsx',

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    preLoaders: [{
      test: '\\.js$',
      exclude: 'node_modules',
      loader: 'jshint'
    }],

    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader?harmony'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version'
    }, {
      test: /\.sass/,
      loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }]
  }
}
];
