import request from '@/utils/request'
/**
 * 用户登录
 * @param {mobile, password} data 登录的用户信息
 * @returns 登录的结果
 */
export function login(data) {
  // request()等到的返回值就是Promise对象
  const res = request({
    url: '/sys/login',
    method: 'post',
    data
  })
  console.log('res', res)
  return res
}

/**
 * 获取用户的档案
 * @returns
 */
export function userProfile() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * 获取用户的信息
 * @returns
 */
export function userInfo(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get'
  })
}

export function getInfo(token) {
}
export function logout() {
}

/**
 * @description: 获取用某个用户的信息
 * @param {*} id
 * @return {*}
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put', // 全量修改
    data
  })
}

// // 对 “用户” 的操作

// // 导入我们自己二次封装的axios
// import request from '@/utils/request'

// // 登录

// // 改密码
// export function xxx(data) {
//   // request()等到的返回值就是Promise对象
//   const res = request({
//     url: '/xxxxx',
//     method: 'post',
//     data
//   })
//   console.log("res", res)
//   return res
// }

// // 获取信息
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
