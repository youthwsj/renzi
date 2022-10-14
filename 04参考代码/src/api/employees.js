import request from '@/utils/request'

// 获取员工的简单信息
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 获取员工的简单信息
// {page:1, size: 10}
export function getEmployee(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    method: 'DELETE',
    url: '/sys/user/' + id
    // methods: 'DELETE'
    // 相当于我们根本没有设置method这个属性 -> 默认是get
  })
}

// 添加员工
export function addEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user/',
    data
  })
}

// 导入员工
export function importEmployees(data) {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

/**
 * @description: 为用户分配角色
 * @param {*} data { id:当前用户id, roleIds:选中的角色id组成的数组 }
 * @return {*}
 */
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}

