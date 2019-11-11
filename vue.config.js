process.env.VUE_APP_VERSION = require('./package.json').version
module.exports = {
  configureWebpack: {
    entry: './src/main.ts'
  },
  // eslint-disable-next-line no-path-concat
  outputDir:  __dirname + '/lib'
}