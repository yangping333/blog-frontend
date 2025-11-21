import request from '@/utils/request'

// 用户列表查询
export const getUserList = (params) => {
  return request({
    url: '/users/select',
    method: 'get',
    params,
  })
}

// 根据 ID 查询用户
export const getUserById = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

// 添加用户
export const addUser = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data,
  })
}

// 修改用户信息
export const updateUser = (data) => {
  return request({
    url: '/users',
    method: 'put',
    data,
  })
}

// 删除用户
export const deleteUsers = (ids) => {
  return request({
    url: `/users/${ids}`,
    method: 'delete',
  })
}

// 修改密码
export const updatePassword = (data) => {
  return request({
    url: '/users/password',
    method: 'put',
    data,
  })
}

