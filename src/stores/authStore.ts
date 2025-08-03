import { create } from 'zustand'

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
    // 模拟登录逻辑
    if (email && password) {
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