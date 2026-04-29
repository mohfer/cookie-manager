import { describe, expect, it, vi } from 'vitest'
import { createCookieApi, deleteCookieApi, getCookieApi, getCookiesApi, updateCookieApi } from '../cookies'

vi.mock('../client', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '../client'

const apiResponse = (data) => ({ json: vi.fn().mockResolvedValue({ data }) })

describe('cookies API', () => {
  it('fetches all cookies', async () => {
    apiFetch.mockResolvedValue(apiResponse([{ id: 1 }]))

    await expect(getCookiesApi()).resolves.toEqual([{ id: 1 }])
    expect(apiFetch).toHaveBeenCalledWith('/api/cookies')
  })

  it('fetches one cookie by id', async () => {
    apiFetch.mockResolvedValue(apiResponse({ id: 9 }))

    await expect(getCookieApi(9)).resolves.toEqual({ id: 9 })
    expect(apiFetch).toHaveBeenCalledWith('/api/cookies/9')
  })

  it('creates and updates cookies with JSON bodies', async () => {
    const payload = { name: 'session', domain: 'example.com', value: [{ name: 'sid', value: '1' }] }
    apiFetch.mockResolvedValue(apiResponse({ id: 3, ...payload }))

    await createCookieApi(payload)
    await updateCookieApi(3, payload)

    expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/cookies', { method: 'POST', body: JSON.stringify(payload) })
    expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/cookies/3', { method: 'PUT', body: JSON.stringify(payload) })
  })

  it('deletes cookies by id', async () => {
    apiFetch.mockResolvedValue({})

    await expect(deleteCookieApi(4)).resolves.toBe(true)
    expect(apiFetch).toHaveBeenCalledWith('/api/cookies/4', { method: 'DELETE' })
  })
})
