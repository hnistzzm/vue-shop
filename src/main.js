import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import  axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//在连接端口之前，通过axios拦截器添加token，保证拥有获取数据的权限.
axios.interceptors.request.use(config=>{
  //console.log(config);
  //为请求头对象添加token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //console.log(config.headers.Authorization);
  return config
})
Vue .prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
