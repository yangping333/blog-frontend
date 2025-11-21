import { defineStore } from 'pinia'
import { login, register } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
      token: localStorage.getItem('token') || '',
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userInfo?.role === 1,
  },

  actions: {
    // 登录
    async loginAction(loginData) {
      try {
        const res = await login(loginData)
        if (res.code === 1) {
          this.userInfo = res.data
          this.token = res.data.jwt
          localStorage.setItem('token', res.data.jwt)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          return { success: true }
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // 注册
    async registerAction(registerData) {
      try {
        const res = await register(registerData)
        if (res.code === 1) {
          this.userInfo = res.data
          this.token = res.data.jwt
          localStorage.setItem('token', res.data.jwt)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          return { success: true }
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // 退出登录
    logout() {
      this.userInfo = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
  },
})

