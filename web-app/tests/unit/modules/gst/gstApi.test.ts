import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@core/api/apiClient'
import { gstApi } from '@modules/gst/api/gstApi'

describe('gstApi', () => {
  it('calls listApplications with correct parameters', async () => {
    const mockList = {
      items: [{ id: 'app-1', tradeName: 'Tech Corp', status: 'IN_PROGRESS' }],
      total: 1,
      page: 1,
      pageSize: 10,
    }
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockList)

    const result = await gstApi.listApplications({ status: 'IN_PROGRESS' as any })
    expect(getSpy).toHaveBeenCalledWith('/gst/applications', {
      params: { status: 'IN_PROGRESS' },
    })
    expect(result).toEqual(mockList)
  })

  it('calls getApplication with correct ID', async () => {
    const mockDetail = { id: 'app-99', tradeName: 'Apex Retails' }
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockDetail)

    const result = await gstApi.getApplication('app-99')
    expect(getSpy).toHaveBeenCalledWith('/gst/applications/app-99')
    expect(result).toEqual(mockDetail)
  })

  it('calls register with payload', async () => {
    const payload = {
      businessType: 'proprietorship',
      panNumber: 'ABCDE1234F',
      legalName: 'Apex',
      tradeName: 'Apex Stores',
    } as any
    const mockCreated = { id: 'app-100', ...payload }
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce(mockCreated)

    const result = await gstApi.register(payload)
    expect(postSpy).toHaveBeenCalledWith('/gst/applications', payload)
    expect(result).toEqual(mockCreated)
  })
})
