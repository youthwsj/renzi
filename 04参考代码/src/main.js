import Vue from 'vue'
console.log('main.js', process.env.VUE_APP_ABC)
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon

// 路由导航守卫
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 导入插件-注册全局组件
import MyComponent from '@/components/index.js'
console.log('MyComponent', MyComponent)

Vue.use(MyComponent)

// 定义插件，做按钮级别的权限控制
import directive from './directive'
Vue.use(directive)
// 测试Vue.use的使用
// 1. 定义插件
// const obj = {
//   install(Vue){

//     console.log('插件obj被加载。abc')
//     // 给原型加了num属性
//     //
//     Vue.prototype.num = 10000
//     Vue.prototype.hello = () => {
//       alert('hello')
//     }
//   }
// }
// // 2. 使用插件
// Vue.use(obj)
import i18n from '@/lang'

new Vue({
  el: '#app',
  router, // this.$route
  store, // this.$store.commit
  i18n, // this.$t
  render: h => h(App)
})
