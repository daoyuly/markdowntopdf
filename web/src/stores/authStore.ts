import { create } from 'zustand'
import { login } from '../services/login'

interface AuthState {
  isLoggedIn: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: async (email: string, password: string) => {
    const response = await login({
      username: email,
      password
    })
    // 模拟登录逻辑
    if (response?.user?.id) {
      set({
        isLoggedIn: true,
        user: {
          email,
          name: email.split('@')[0]
        }
      })
      return true
    }
    return false
  },
  logout: () => {
    set({
      isLoggedIn: false,
      user: null
    })
  }
})) 