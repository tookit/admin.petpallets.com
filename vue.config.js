const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProduction = process.env.NODE_ENV !== 'development'

const devNeedCdn = false

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@views', resolve('src/views'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      },
    },
  },
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: process.env.VUE_APP_BASE_API_HOST,
  //       ws: false,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api/": "/api/",
  //       }
  //     }
  //   }
  // },

  assetsDir: 'static',
  runtimeCompiler: true,
}
