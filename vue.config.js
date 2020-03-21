module.exports = {
  chainWebpack: config =>{
    config.when(process.env.NODE_ENV === 'production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals',{
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args =>{
        args[0].isProd = true
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args =>{
        args[0].isProd = false
        return args
      })
    })
  },
  configureWebpack : {
    resolve: {
      alias: {
        "assets": "@/assets",
        "components": "@/components",
        "views": "@/views",
      }
    }
  },
  publicPath: './',
  devServer: {
    proxy: {
        '/api': {
            target: 'http://116.62.5.250:8888/',
            ws: true,//是否代理websockets
            changeOrigin: true   // 设置同源  默认false，是否需要改变原始主机头为目标URL
        }
    }
}
}