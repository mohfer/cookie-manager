import { describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../client'

describe('apiFetch', () => {
  it('sends json, accept, and bearer token headers', async () => {
    sessionStorage.setItem('authToken', 'token-123')
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    await apiFetch('/api/user')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/user', expect.objectContaining({
      headers: expect.objectContaining({
        Accept: 'application/json',
        Authorization: 'Bearer token-123',
        'Content-Type': 'application/json',
      }),
    }))
  })

  it('clears token and throws on unauthorized responses', async () => {
    sessionStorage.setItem('authToken', 'expired')
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 })

    await expect(apiFetch('/api/user')).rejects.toThrow('Authentication required')
    expect(sessionStorage.getItem('authToken')).toBeNull()
  })

  it('uses server error messages when available', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({ message: 'Invalid payload' }),
    })

    await expect(apiFetch('/api/cookies')).rejects.toThrow('Invalid payload')
  })
})
