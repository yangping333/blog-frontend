import request from '@/utils/request'

// 评论列表查询
export const getCommentList = (params) => {
  return request({
    url: '/comments',
    method: 'get',
    params,
  })
}

// 添加评论
export const addComment = (data) => {
  return request({
    url: '/comments',
    method: 'post',
    data,
  })
}

// 删除评论
export const deleteComments = (ids) => {
  return request({
    url: `/comments/${ids}`,
    method: 'delete',
  })
}

