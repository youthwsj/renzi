import request from '@/utils/request'

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
  return request.post('/sys/role/', data)
}

