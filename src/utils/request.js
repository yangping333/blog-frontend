import axios from 'axios'
import { mockApi, USE_MOCK } from '@/mock/index.js'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080', // 后端 API 地址，可根据实际情况修改
  timeout: 10000,
})

// Mock 请求处理函数
const handleMockRequest = async (config) => {
  const url = config.url
  const method = config.method.toLowerCase()
  const params = config.params || {}
  
  // 处理 data，可能是对象、字符串或 FormData
  let data = config.data
  if (!data) {
    data = {}
  } else if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.warn('Failed to parse data as JSON:', data)
      data = {}
    }
  } else if (data instanceof FormData) {
    // FormData 需要特殊处理
    const formDataObj = {}
    for (const [key, value] of data.entries()) {
      formDataObj[key] = value
    }
    data = formDataObj
  }

  // 调试日志（可选，生产环境可移除）
  // console.log('Mock request:', method.toUpperCase(), url, data)

  // 根据 URL 和 method 路由到对应的 mock 函数
  let mockResponse

  if (url === '/login' && method === 'post') {
    mockResponse = await mockApi.login(data)
  } else if (url === '/register' && method === 'post') {
    mockResponse = await mockApi.register(data)
  } else if (url === '/users/select' && method === 'get') {
    mockResponse = await mockApi.getUserList(params)
  } else if (url.startsWith('/users/') && url !== '/users/password' && method === 'get') {
    const id = url.split('/')[2]
    mockResponse = await mockApi.getUserById(id)
  } else if (url === '/users' && method === 'post') {
    mockResponse = await mockApi.addUser(data)
  } else if (url === '/users' && method === 'put') {
    mockResponse = await mockApi.updateUser(data)
  } else if (url.startsWith('/users/') && method === 'delete') {
    const ids = url.split('/')[2]
    mockResponse = await mockApi.deleteUsers(ids)
  } else if (url === '/users/password' && method === 'put') {
    mockResponse = await mockApi.updatePassword(data)
  } else if (url === '/articles/select' && method === 'get') {
    mockResponse = await mockApi.getArticleList(params)
  } else if (url.startsWith('/articles/') && method === 'get') {
    const id = url.split('/')[2]
    mockResponse = await mockApi.getArticleById(id)
  } else if (url === '/articles' && method === 'post') {
    mockResponse = await mockApi.addArticle(data)
  } else if (url === '/articles' && method === 'put') {
    mockResponse = await mockApi.updateArticle(data)
  } else if (url.startsWith('/articles/') && method === 'delete') {
    const ids = url.split('/')[2]
    mockResponse = await mockApi.deleteArticles(ids)
  } else if (url === '/comments' && method === 'get') {
    mockResponse = await mockApi.getCommentList(params)
  } else if (url === '/comments' && method === 'post') {
    mockResponse = await mockApi.addComment(data)
  } else if (url.startsWith('/comments/') && method === 'delete') {
    const ids = url.split('/')[2]
    mockResponse = await mockApi.deleteComments(ids)
  } else if (url === '/article-like' && method === 'post') {
    mockResponse = await mockApi.toggleArticleLike(data)
  } else if (url === '/article-favorite' && method === 'post') {
    mockResponse = await mockApi.toggleArticleFavorite(data)
  } else if (url === '/article-favorite' && method === 'get') {
    mockResponse = await mockApi.getFavoriteList(params)
  } else if (url === '/user-follow' && method === 'put') {
    mockResponse = await mockApi.toggleFollow(data)
  } else if (url === '/user-follow/following' && method === 'get') {
    mockResponse = await mockApi.getFollowingList(params)
  } else if (url === '/user-follow/follower' && method === 'get') {
    mockResponse = await mockApi.getFollowerList(params)
  } else if (url === '/tags/select' && method === 'get') {
    mockResponse = await mockApi.getTagList(params)
  } else if (url.startsWith('/tags/') && method === 'get') {
    const id = url.split('/')[2]
    mockResponse = await mockApi.getTagById(id)
  } else if (url === '/tags' && method === 'post') {
    mockResponse = await mockApi.addTag(data)
  } else if (url === '/tags' && method === 'put') {
    mockResponse = await mockApi.updateTag(data)
  } else if (url.startsWith('/tags/') && method === 'delete') {
    const ids = url.split('/')[2]
    mockResponse = await mockApi.deleteTags(ids)
  } else if (url === '/upload' && method === 'post') {
    // 处理文件上传
    const file = data instanceof FormData ? data.get('image') : data.image
    mockResponse = await mockApi.uploadImage(file)
  } else {
    // 未匹配的请求，返回错误
    mockResponse = { code: 0, msg: 'Mock API not implemented', data: null }
  }

  return mockResponse
}

// 自定义适配器：在 mock 模式下使用 mock 数据
const customAdapter = async (config) => {
  if (USE_MOCK) {
    const mockResponse = await handleMockRequest(config)
    
    // 如果响应码为 0，表示失败，需要处理错误
    if (mockResponse.code === 0) {
      if (mockResponse.msg === 'NOT_LOGIN') {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }
      const error = new Error(mockResponse.msg || '请求失败')
      error.response = {
        data: mockResponse,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
      }
      throw error
    }

    // 返回模拟的响应
    return Promise.resolve({
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })
  }

  // 真实请求：使用 axios 的默认适配器
  // 创建一个新的 axios 实例用于真实请求
  const realRequest = axios.create({
    baseURL: config.baseURL || 'http://localhost:8080',
    timeout: config.timeout || 10000,
  })
  
  // 使用真实请求发送
  return realRequest(config)
}

// 设置自定义适配器
request.defaults.adapter = customAdapter

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 如果响应码为 1，表示成功
    if (res.code === 1) {
      return res
    } else {
      // 如果响应码为 0，表示失败
      // 检查是否是未登录
      if (res.msg === 'NOT_LOGIN') {
        // 清除本地存储的 token 和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 跳转到登录页
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
  },
  (error) => {
    // 如果是网络错误且启用了 mock，尝试使用 mock 数据
    if (USE_MOCK && error.message && error.message.includes('Network Error')) {
      console.warn('网络错误，但已启用 mock 模式，应该不会出现此错误')
    }
    return Promise.reject(error)
  }
)

export default request

