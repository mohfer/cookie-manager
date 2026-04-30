import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCookieForm from '../AddCookieForm'

describe('AddCookieForm', () => {
  it('requires name, domain, and value', async () => {
    const onSubmit = vi.fn()
    render(<AddCookieForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /add cookie/i }))

    expect(screen.getByText('All fields are required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits parsed JSON cookie values and resets the form', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AddCookieForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/cookie name/i), 'Example')
    await userEvent.type(screen.getByLabelText(/domain/i), 'example.com')
    await userEvent.click(screen.getByLabelText(/cookie value/i))
    await userEvent.paste('[{"name":"sid","value":"abc"}]')
    await userEvent.click(screen.getByRole('button', { name: /add cookie/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Example',
      domain: 'example.com',
      value: [{ name: 'sid', value: 'abc' }],
      overwrite: false,
    })
    expect(screen.getByLabelText(/cookie name/i)).toHaveValue('')
  })

  it('submits plain text values when JSON parsing fails', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AddCookieForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/cookie name/i), 'Plain')
    await userEvent.type(screen.getByLabelText(/domain/i), 'example.com')
    await userEvent.type(screen.getByLabelText(/cookie value/i), 'raw-value')
    await userEvent.click(screen.getByRole('button', { name: /add cookie/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Plain',
      domain: 'example.com',
      value: 'raw-value',
      overwrite: false,
    })
  })

  it('shows submit errors and calls cancel handler', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Server rejected'))
    const onCancel = vi.fn()
    render(<AddCookieForm onSubmit={onSubmit} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText(/cookie name/i), 'Bad')
    await userEvent.type(screen.getByLabelText(/domain/i), 'example.com')
    await userEvent.type(screen.getByLabelText(/cookie value/i), 'raw')
    await userEvent.click(screen.getByRole('button', { name: /add cookie/i }))

    expect(await screen.findByText('Server rejected')).toBeInTheDocument()
  })
})
