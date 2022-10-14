import request from '@/utils/request'

export const getDepartments = function() {
  return request.get('/company/department')
}

export const getSimpleEmployee = function() {
  return request.get('/sys/user/simple')
}

export const addDepartment = function(data) {
  return request.post('/company/department', data)
}

export const delDepartment = function(id) {
  return request.delete('/company/department/' + id)
}
