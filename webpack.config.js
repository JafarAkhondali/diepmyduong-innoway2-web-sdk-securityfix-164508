
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

library_name = "innoway2";
output = "dist";

module.exports = {
  'entry': {
    // your entry file file (entry.ts or entry.js)
    'd3metric': ['./src/index'],
    // 'd3metric.demo': ['./demo/demo.entry'],
  },
  'output': {
    'path': __dirname,
    'filename': output +'/'+library_name+'.min.js',
    library: library_name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  'module': {
    'loaders': [
      // ts-loader: convert typescript (es6) to javascript (es6),
      // babel-loader: converts javascript (es6) to javascript (es5)
      {
        'test': /\.tsx?$/,
        'loaders': ['babel-loader','ts-loader'],
        'exclude': [/node_modules/,nodeModulesPath]
      },
      // babel-loader for pure javascript (es6) => javascript (es5)
      {
        'test': /\.(jsx?)$/,
        'loaders': ['babel'],
        'exclude': [/node_modules/,nodeModulesPath]
      }
    ]
  },
  'externals': {
    // don't bundle the 'react' npm package with our bundle.js
    // but get it from a global 'React' variable
    'react': 'React'
  },
  'plugins': [],
  'resolve': {
    'root': [
      path.resolve('./src'),
      'node_modules'
    ],
    'extensions': ['', '.js', '.jsx', '.ts', '.tsx'],

    // this is only required when we "import 'jquery'"
    // 'alias': { 'jquery': path.join(__dirname, "vendor", "jquery-2.2.0.min.js") }
  }
};
