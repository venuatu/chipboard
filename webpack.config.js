/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

'use strict';
var webpack = require('webpack');
var path = require("path");

var commonLoaders = [{
  test: /\.jsx$/,
  loader: 'react-hot!jsx-loader?harmony'
}, {
  test: /\.sass/,
  loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!sass-loader?outputStyle=expanded'
}, {
  test: /\.css$/,
  loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version'
},{
  test: /\.(png|jpg)$/,
  loader: 'url-loader?limit=8192'
}];
var assetsPath = path.join(__dirname, "public", "assets");
var publicPath = "/assets/";

module.exports = [
  {

    output: {
      filename: 'main.js',
      publicPath: publicPath,
    },

    cache: true,
    debug: true,
    devtool: false,
    entry: [
        'webpack/hot/only-dev-server',
        './src/scripts/main.jsx'
    ],

    stats: {
      colors: true,
      reasons: true
    },

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      preLoaders: [{
        test: '\\.js$',
        exclude: 'node_modules',
        loader: 'jshint'
      }],
      loaders: commonLoaders.concat([]),
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]

  },  {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    entry: "./src/scripts/main.jsx",
    target: "node",
    output: {
      path: assetsPath,
      filename: "clientSide.js",
      publicPath: publicPath,
      libraryTarget: "commonjs2"
    },
    externals: /^[a-z\-0-9]+$/,
    module: {
      loaders: commonLoaders.concat([
        // { test: /\.css$/,  loader: path.join(__dirname, "server", "style-collector") + "!css-loader" },
      ])
    }
  }
];
