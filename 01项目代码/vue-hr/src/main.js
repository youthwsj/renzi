// console.log('环境变量集合', process.env)
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import MyCom from '@/components'
Vue.use(MyCom)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import directive from '@/Directive'
Vue.use(directive)
import '@/styles/index.scss' // global css

import App from './App'
import store from './store' // './store/index.js'
// 引入路由
import router from './router'

// 定义了 svg-icon组件
import '@/icons' // icon

// 引入路由守卫
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router, // 路由
  store, // vuex
  render: h => h(App)
})
