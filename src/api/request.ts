import axios, { AxiosError, AxiosInstance } from 'axios'
import { message } from 'antd'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    // Session 模式：浏览器自动携带 Cookie，无需手动设置 Token
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200) {
      message.error(data.msg || '请求失败')
      return Promise.reject(new Error(data.msg))
    }
    return data.data as never
  },
  (error: AxiosError) => {
    const status = error.response?.status
    switch (status) {
      case 401:
        message.error('登录已过期，请重新登录')
        window.location.href = '/login'
        break
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
