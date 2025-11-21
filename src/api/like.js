import request from '@/utils/request'

// 文章点赞/取消点赞
export const toggleArticleLike = (data) => {
  return request({
    url: '/article-like',
    method: 'post',
    data,
  })
}

