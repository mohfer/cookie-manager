import { describe, expect, it, vi } from 'vitest'
import { forgotPasswordApi, loginApi, registerApi, resetPasswordApi } from '../auth'

const jsonResponse = (ok, body) => ({ ok, json: vi.fn().mockResolvedValue(body) })

describe('auth API', () => {
  it('posts login credentials and returns response data', async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(true, { data: { token: 'abc' } }))

    await expect(loginApi('demo@example.com', 'Password1234')).resolves.toEqual({ token: 'abc' })
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ login: 'demo@example.com', password: 'Password1234' }),
    }))
  })

  it('throws login errors from the API', async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(false, { message: 'Bad credentials' }))

    await expect(loginApi('bad', 'wrong')).rejects.toThrow('Bad credentials')
  })

  it('posts registration data and returns user token data', async () => {
    const payload = { email: 'new@example.com', password: 'Password1234', password_confirmation: 'Password1234' }
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(true, { data: { token: 'new-token' } }))

    await expect(registerApi(payload)).resolves.toEqual({ token: 'new-token' })
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/register', expect.objectContaining({ body: JSON.stringify(payload) }))
  })

  it('handles forgot and reset password success responses', async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(true, {}))

    await expect(forgotPasswordApi('user@example.com')).resolves.toBe(true)
    await expect(resetPasswordApi({ email: 'user@example.com', token: 'tok', password: 'Password1234', password_confirmation: 'Password1234' })).resolves.toBe(true)
  })
})
