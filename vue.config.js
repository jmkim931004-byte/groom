const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  // pwa: {
  //   name: 'Vue Argon Design',
  //   themeColor: '#172b4d',
  //   msTileColor: '#172b4d',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: '#172b4d'
  // },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // /api는 빼고 지정
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' // /api 경로를 유지 (필요 없으면 {} 또는 삭제 가능)
        }
      }
    }
  },
  outputDir: '../backend/public',  //② 배포 파일의 위치를 지정
};
