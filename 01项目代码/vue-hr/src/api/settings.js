import request from '@/utils/request'

// 获取员工列表
// 参数 page页数  pagesize每页条数
export const getRoles = function(params) {
  return request.get('/sys/role', { params })
}
