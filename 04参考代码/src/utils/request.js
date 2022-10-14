// 对axios的二次封装
// 1. 基地址
// 2. 最长等待时间
// 3. 请求拦截器
// 4. 响应拦截器

// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
const service = axios.create(
  // 基地址
  // 最长等待时间
  // 不写baseURL就会默认请求本地的域名
  {
    baseURL: process.env.VUE_APP_BASE_API,
    // baseURL: 'http://ihrm-java.itheima.net',
    // baseURL: 'http://localhost:8080',
    // baseURL: 'http://localhost:3000',
    // 'http://ihrm-java.itheima.net', // 设置axios请求的基础的基础地址
    timeout: 5000 // 定义5秒超时
  }
) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  console.log('请求拦截器', store)
  // 如果有token，就带上
  // 获取vuex中的token
  const token = store.state.user.token
  if (token) {
    // 设置到请求头上
    console.log(config)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 根据是否有 success:false来判断操作是否成功
  // console.log('响应拦截器', response)

  // 1. 判断操作是否成功
  if (response.data.success === false) {
    // 本次操作没有成功，抛出错误
    return Promise.reject(response.data.message)
  } else {
    // 2. 操作成功，脱壳：去掉data
    return response.data
  }
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.dir(error)
  if (error.response.data.code === 10002) {
    // token超时
    // 1. 本地数据删除
    store.dispatch('user/logout') // token ===> "" ??
    // 2. 回到登录页
    // this.$router.push('/login?return_url=' + encodeURIComponent(this.$route.fullPath))
    // 如何在.js文件中拿到当前的路由的path？
    router.push('/login?return_url=' + encodeURIComponent(router.currentRoute.fullPath))
  }
  return Promise.reject(error)
})

export default service // 导出axios实例
