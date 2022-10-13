/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/water-me-automation/'
    : '/',

  // Remove moment.js from chart.js
  configureWebpack: config => {
    return {
      externals: {
        moment: 'moment'
      }
    }
  }
}
