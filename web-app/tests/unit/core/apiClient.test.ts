import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@core/api/apiClient'
import { axiosInstance } from '@core/api/axiosInstance'

describe('apiClient', () => {
  it('unwraps response.data on successful GET', async () => {
    const mockData = { id: 'gst-123', status: 'ACTIVE' }
    vi.spyOn(axiosInstance, 'request').mockResolvedValueOnce({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    })

    const result = await apiClient.get('/test-endpoint')
    expect(result).toEqual(mockData)
  })

  it('passes payload and method on POST', async () => {
    const payload = { panNumber: 'ABCDE1234F' }
    const mockResponse = { success: true }
    const spy = vi.spyOn(axiosInstance, 'request').mockResolvedValueOnce({
      data: mockResponse,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {} as any,
    })

    const result = await apiClient.post('/gst/register', payload)
    expect(result).toEqual(mockResponse)
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/gst/register',
        method: 'POST',
        data: payload,
      })
    )
  })

  it('normalises network errors into AppError', async () => {
    vi.spyOn(axiosInstance, 'request').mockRejectedValueOnce(new Error('Network offline'))

    await expect(apiClient.get('/unreachable')).rejects.toThrow('Network offline')
  })
})
