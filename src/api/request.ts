import axios, { AxiosError, AxiosInstance } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/store/useUserStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (data.code !== 0) {
      const isLoginRequest = config.url?.includes('/auth/login')
      const isLoginPage = window.location.pathname === '/login'
      if (!(isLoginRequest && isLoginPage)) {
        message.error(data.msg || '请求失败')
      }
      return Promise.reject(new Error(data.msg))
    }
    return data.data as never
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    const isLoginPage = window.location.pathname === '/login'
    const skipGlobalError = isLoginRequest && isLoginPage
    switch (status) {
      case 401: {
        useUserStore.getState().logout()
        if (isLoginPage) {
          if (!skipGlobalError) {
            const data = error.response?.data as { msg?: string } | undefined
            message.error(data?.msg || '用户名或密码错误')
          }
        } else {
          message.error('登录已过期，请重新登录')
          window.location.href = '/login'
        }
        break
      }
      case 403:
        message.error('无权限访问')
        break
      case 500:
        message.error('服务器错误')
        break
      default:
        message.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  },
)

export default request

export function get<T>(url: string, params?: object): Promise<T> {
  return request.get(url, { params }) as Promise<T>
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return request.post(url, data) as Promise<T>
}

export function put<T>(url: string, data?: unknown): Promise<T> {
  return request.put(url, data) as Promise<T>
}

export function del<T>(url: string): Promise<T> {
  return request.delete(url) as Promise<T>
}

export function upload<T>(url: string, file: File): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<T>
}
