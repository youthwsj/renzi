import request from '@/utils/request'

// 获取角色的信息
/**
 *
 * @param {page:1, pagesize: 10} params
 * @returns
 */
export function getRoles(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

// 删除
export function delRole(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}

// 编辑
export function editRole(data) {
  return request({
    url: '/sys/role/' + data.id,
    method: 'put',
    data
  })
}

// 添加
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

