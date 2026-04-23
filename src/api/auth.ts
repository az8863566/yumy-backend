import { get, post } from './request'
import type { AuthLoginDTO, AuthLoginVO } from '@/types'

export function login(data: AuthLoginDTO) {
  return post<AuthLoginVO>('/admin/v1/auth/login', data)
}

export function logout() {
  return post<void>('/admin/v1/auth/logout')
}
