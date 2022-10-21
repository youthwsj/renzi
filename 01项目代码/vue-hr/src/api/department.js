import request from '@/utils/request'
// 获取部门信息函数
export const getDepartments = function() {
  return request.get('/company/department')
}
// 获取负责人列表
export const getSimpleEmployee = function() {
  return request.get('/sys/user/simple')
}
// 新增模块
export const addDepartment = function(data) {
  return request.post('/company/department', data)
}
// 删除模块
export const delDepartment = function(id) {
  return request.delete('/company/department/' + id)
}
// 获取详情
export const getDepartDetail = function(id) {
  return request.get('/company/department/' + id)
}
// 编辑数据
export const updateDepartment = function(data) {
  return request.put('/company/department/' + data.id, data)
}
