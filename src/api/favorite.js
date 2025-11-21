import request from '@/utils/request'

// 收藏/取消收藏文章
export const toggleArticleFavorite = (data) => {
  return request({
    url: '/article-favorite',
    method: 'post',
    data,
  })
}

// 收藏列表查询
export const getFavoriteList = (params) => {
  return request({
    url: '/article-favorite',
    method: 'get',
    params,
  })
}

