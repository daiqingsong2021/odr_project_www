/* eslint-disable */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const webpack = require('webpack')

let extractCssInitialized = false
const cssLoaderConfig = ({
  cssModules = false,
  dev,
  isServer,
  cssLoaderOptions = {},
  loaders = []
}) => {

  // We have to keep a list of extensions for the splitchunk config

  let postcssLoader


  const cssLoader = {
    loader: isServer ? 'css-loader/locals' : 'css-loader',
    options: Object.assign(
      {},
      {
        modules: cssModules,
        minimize: !dev,
        sourceMap: dev,
        importLoaders: loaders.length + (postcssLoader ? 1 : 0)
      },
      cssLoaderOptions
    )
  }

  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ['ignore-loader']
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules) {
    return [cssLoader, postcssLoader, ...loaders].filter(Boolean)
  }

  return [
    !isServer && dev && 'extracted-loader',
    !isServer && MiniCssExtractPlugin.loader,
    cssLoader,
    postcssLoader,
    ...loaders
  ].filter(Boolean)
}

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => { }
}



module.exports = {
  cssModules: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[name]___[local]___[hash:base64:5]",
  },
  pageExtensions: ['jsx', 'js'],
  webpack(config, { dev, isServer, defaultLoaders }) {

    const fileExtensions = new Set()
    const extensions = ['less', 'css']
    for (const extension of extensions) {
      fileExtensions.add(extension)
    }

    const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        if (
            entries['main.js'] &&
            !entries['main.js'].includes('./client/polyfills.js')
        ) {
            entries['main.js'].unshift('./client/polyfills.js');
        }
        return entries;
    };
    
    config.module.rules.push({
      test: /\.less$/,
      use: cssLoaderConfig({
        cssModules: true,
        dev,
        isServer,
        cssLoaderOptions: {
          importLoaders: 1,
          localIdentName: "[local]___[hash:base64:5]",
        },
        loaders: [
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }),
      exclude: [
        /node_modules/
      ],
    })

    config.module.rules.push({
      test: /\.css$/,
      use: cssLoaderConfig({
        dev,
        isServer
      }),
      exclude: [
        /node_modules/
      ],
    })

    config.module.rules.push({
      test: /\.(less|css)$/,
      use: cssLoaderConfig({
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            }
          }
        ]
      }),
      include: [
        /node_modules/
      ],
    })



    if (!isServer) {
      config.optimization.splitChunks = {
        maxAsyncRequests: 50,
        maxInitialRequests: 30,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: new RegExp(`\\.+(${[...fileExtensions].join('|')})$`),
            chunks: 'all',
            enforce: true
          }
        }
      }
    }

    if (!isServer && !extractCssInitialized) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: dev
            ? 'static/css/[name].css'
            : 'static/css/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'static/css/[name].chunk.css'
            : 'static/css/[name].[contenthash:8].chunk.css'
        })
      )
      config.plugins.push(
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      )

      extractCssInitialized = true
    }

    config.module.rules.push({
      test: /\.(png|jpg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/images',
          name: '[name].[ext]'
        }
      }
    })

    config.module.rules.push({
      test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: './',
          outputPath: 'static/fonts',
          name: '[name].[ext]'
        }
      }
    })

    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.json'],
      // 设置快捷路径
      alias: {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './'),
      },
    };
    // 注入api
    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          'API': JSON.stringify(process.env.API)
        }
      })
    ];
    return config
  },
}
