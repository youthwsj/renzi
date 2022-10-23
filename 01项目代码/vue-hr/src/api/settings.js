import request from '@/utils/request'

// 获取员工角色
export const getUserDetailById = function(id) {
  return request.get(`/sys/user/${id}`)
}
// 获取员工列表
// 参数 page页数  pagesize每页条数
export const getRoles = function(params) {
  return request.get('/sys/role', { params })
}
// 删除员工数据
// 参数 id
export const loadDelRoles = function(id) {
  return request.delete('/sys/role/' + id)
}

// 添加员工数据
// 参数 name 和description
export const addRoles = function(data) {
  return request.post('/sys/role', data)
}

// 修改员工数据
// 参数 name 和description和 id
export const editRoles = function(data) {
  return request.put('/sys/role/' + data.id, data)
}

//  给员工分配角色
// data: { id, roleIds }
export const assignRoles = function(data) {
  return request.put('/sys/user/assignRoles', data)
}

// 获取当前角色权限
export const getRoleDetail = function(id) {
  return request.get(`/sys/role/${id}`)
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
