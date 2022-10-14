import request from '@/utils/request'
/**
 * @description: 获取角色详情
 * @param {*} id 角色id
 * @return {*}
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
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
