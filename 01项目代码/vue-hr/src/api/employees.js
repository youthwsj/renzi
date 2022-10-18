import request from '@/utils/request'

// 获取员工列表 参数page页数 size每页条数
export const getEmployees = function(data) {
  return request.get('/sys/user', { params: data })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
// 增加员工
export const addEmployees = function(data) {
  return request.post('/sys/user', data)
}

// 批量导入员工

export const addDatchEmployees = function(data) {
  return request.post('/sys/user/batch', data)
}
