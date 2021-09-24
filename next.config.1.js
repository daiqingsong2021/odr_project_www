/* eslint-disable */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const path = require('path')
const internalNodeModulesRegExp = /src(?!\/(?!.*js))/

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withLess({
  cssModules: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[name]___[local]___[hash:base64:5]",
  },
  pageExtensions: ['jsx', 'js'],
  // webpack(config, { dev, isServer, defaultLoaders }){

   /*  
    
    config.module.rules.push({
      test: /\.less$/,
      use: defaultLoaders.less,
      exclude: [
        /node_modules/
      ],  
    }) */

    /* config.module.rules.push({
      test: /\.(css|less)$/,
      use: defaultLoaders.less,
      exclude: [
        /src/
      ],  
    }) */
    
    /* config.module.rules.push({
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            }
          }
        ],
      }),
      include:[
        /node_modules/
      ],
    }) */
    
   /*  config.plugins.push(new ExtractTextPlugin({
      filename: 'static/style.css'
    })) */

    // return commonsChunkConfig(config, /\.(less|css)$/)
    // return config
  // }
})
