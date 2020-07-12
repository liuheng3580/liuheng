// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import './plugins/element.js'
import'./assets/css/global.css'
import './assets/fonts/iconfont.css'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式

Vue.use(VueQuillEditor)


import axios from 'axios'
//配置请求的根路径
 axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
 axios.interceptors.request.use(config =>{
   console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
 Vue.prototype.$http = axios 

Vue.config.productionTip = false

// 自定义时间的全局过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
