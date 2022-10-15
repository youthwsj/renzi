import axios from 'axios'
import router from '@/router'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
// 创建 axios 的实例
// const service = axios.create({
//   // 基地址
//   // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   baseURL: 'http://xxxxx.com/api', // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   // 超时的时间
//   timeout: 5000 // request timeout
// })

// // request interceptor

const service = axios.create({
  // 基地址由环境变量来决定
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://ihrm-java.itheima.net',
  timeout: 5000
})

// response interceptor
// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log('从后端回来的数据', response)
    if (response.data.success === false) {
      // 抛出错误: 返回一个错误状态的promise
      return Promise.reject(new Error(response.data.message))
    } else {
      return response.data
    }
  },
  error => {
    // 1. 发axios时，状态码不是2打头
    // 2. 网络问题： 超时，断网...
    console.log('响应拦截器,错误信息')
    console.dir(error)
    if (error.response.data.code === 10002) {
      // token过期
      // 1. 删除本地登录信息
      store.dispatch('user/userLogout')
      // 2. 跳转，重新登录
      // router.push('/login?return_url=' + 当前的path)
      // router.currentRoute <====> this.$route
      router.push('/login?return_url=' + router.currentRoute.path)
    }
    return Promise.reject(error)
  }
)

// 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log('所有的请求发出去之前，都会走这里', config)
    // console.log(store)
    const token = store.state.user.token
    // 如果有token就带上
    if (token) {
      // 根据接口文档要求，把token设置到请求头上
      config.headers.Authorization = `Bearer ${token}`
    }

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

export default service
