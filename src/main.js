import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Input,Form,FormItem,Button,Message} from 'element-ui'

import 'assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1"
Vue.prototype.$http=axios
Vue.prototype.$message=Message

Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
