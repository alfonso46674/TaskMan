const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: config => {
    config.externals = {
      'better-sqlite3': 'commonjs better-sqlite3'
    }
  },
  pluginOptions:{
    electronBuilder: {
      externals: [
        'better-sqlite3'
      ],
      builderOptions: {
        extraResources: [
          {
            from: './public/db/',
            to: 'db/',
            filter: [
              '**/*'
            ]
          }
        ]
      }
    },
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
