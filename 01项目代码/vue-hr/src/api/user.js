// 导入axios工具
import request from '@/utils/request'

// 封装函数

// data: { mobile: '', password: '' }
export function login(data) {
  // 之前
  // axios.get('接口地址', { params: { 参数 }})
  // axios.post('接口地址', { 参数 })
  // 现在
  // axios的实例({
  //   url: '接口地址',
  //   method: '请求方式 post ',
  //   data: { 参数 }
  // })
  // axios的实例({
  //   url: '接口地址',
  //   method: '请求方式 get ',
  //   params: { 参数 }
  // })
  return request.post('/sys/login', data)
  // return request({
  //   url: '/vue-admin-template/user/login',
  //   method: 'post',
  //   data
  // })
}

// 获取用户的信息
export function getProfile() {
  return request.post('/sys/profile')
}

// 获取用户的详细信息
export function getUserDetailById(userId) {
  return request.get('/sys/user/' + userId)
}

export function logout() {

}

// 更新用户信息
// 获取用户的详细电话信息
export function saveUserDetailById(data) {
  return request.put('/sys/user/' + data.id, data)
}
// 导出有两种
// 1. 按需导出                     导入
//  export function xxx(){}       import { xxx } from ''
// 2. 默认导出
//  export default {}             import xx from ''

