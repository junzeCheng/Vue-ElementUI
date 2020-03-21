import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import quillEditor from 'vue-quill-editor' // 调用富文本编辑器
// import 'quill/dist/quill.snow.css' // 富文本编辑器外部引用样式  三种样式三选一引入即可
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.bubble.css'

// import "./common/element.js"

import 'assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL="http://116.62.5.250:8888/api/private/v1"
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})

Vue.prototype.$http=axios


Vue.component("tree-table",TreeTable)
Vue.use(quillEditor)



Vue.config.productionTip = false


// 时间过滤器
Vue.filter('dataFormat',function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,"0")
  const d = (dt.getDate()+'').padStart(2,'')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
