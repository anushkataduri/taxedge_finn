import type { AxiosRequestConfig } from 'axios'

import { toAppError } from '../errors/errorHandler'
import { axiosInstance } from './axiosInstance'
import { registerInterceptors } from './interceptors'

registerInterceptors(axiosInstance)

/**
 * The only HTTP surface modules are allowed to use.
 * It unwraps the response body and converts failures into AppError.
 */
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>(config)
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'GET' }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, data, method: 'POST' }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, data, method: 'PUT' }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, data, method: 'PATCH' }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'DELETE' }),
  upload: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    request<T>({
      ...config,
      url,
      data: formData,
      method: 'POST',
      headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
    }),
}
