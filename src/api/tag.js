import request from '@/utils/request'

// 标签列表查询
export const getTagList = (params) => {
  return request({
    url: '/tags/select',
    method: 'get',
    params,
  })
}

// 根据 ID 查询标签
export const getTagById = (id) => {
  return request({
    url: `/tags/${id}`,
    method: 'get',
  })
}

// 添加标签
export const addTag = (data) => {
  return request({
    url: '/tags',
    method: 'post',
    data,
  })
}

// 修改标签
export const updateTag = (data) => {
  return request({
    url: '/tags',
    method: 'put',
    data,
  })
}

// 删除标签
export const deleteTags = (ids) => {
  return request({
    url: `/tags/${ids}`,
    method: 'delete',
  })
}

