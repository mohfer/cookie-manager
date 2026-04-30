import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddCookieForm from '../components/forms/AddCookieForm'

describe('AddCookieForm', () => {
    let mockOnSubmit
    let mockOnCancel

    beforeEach(() => {
        mockOnSubmit = vi.fn()
        mockOnCancel = vi.fn()
    })

    it('renders form fields correctly', () => {
        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        expect(screen.getByLabelText(/cookie name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/domain/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/cookie value/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /add cookie/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('shows error when submitting empty form', async () => {
        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        const submitButton = screen.getByRole('button', { name: /add cookie/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/all fields are required/i)).toBeInTheDocument()
        })

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('submits form with valid data', async () => {
        mockOnSubmit.mockResolvedValue()

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test_cookie' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: '[{"name":"session","value":"abc123"}]' }
        })

        const submitButton = screen.getByRole('button', { name: /add cookie/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'test_cookie',
                domain: 'example.com',
                value: [{ name: 'session', value: 'abc123' }],
                overwrite: false
            })
        })
    })

    it('parses JSON value correctly', async () => {
        mockOnSubmit.mockResolvedValue()

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: '{"key":"value"}' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    value: { key: 'value' }
                })
            )
        })
    })

    it('uses plain string when JSON parsing fails', async () => {
        mockOnSubmit.mockResolvedValue()

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: 'not valid json' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    value: 'not valid json'
                })
            )
        })
    })

    it('shows confirmation dialog on duplicate error (422)', async () => {
        const error = {
            response: { status: 422 },
            message: 'Duplicate cookie'
        }
        mockOnSubmit.mockRejectedValue(error)

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test_cookie' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: 'test' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(screen.getByText(/cookie already exists/i)).toBeInTheDocument()
            expect(screen.getByText(/test_cookie/)).toBeInTheDocument()
            expect(screen.getByText(/example.com/)).toBeInTheDocument()
        })
    })

    it('handles overwrite confirmation', async () => {
        const error = {
            response: { status: 422 },
            message: 'Duplicate cookie'
        }
        mockOnSubmit.mockRejectedValueOnce(error).mockResolvedValueOnce()

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test_cookie' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: 'test' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(screen.getByText(/cookie already exists/i)).toBeInTheDocument()
        })

        const overwriteButton = screen.getByRole('button', { name: /overwrite/i })
        fireEvent.click(overwriteButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(2)
            expect(mockOnSubmit).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    overwrite: true
                })
            )
        })
    })

    it('handles cancel overwrite', async () => {
        const error = {
            response: { status: 422 },
            message: 'Duplicate cookie'
        }
        mockOnSubmit.mockRejectedValue(error)

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: 'test' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(screen.getByText(/cookie already exists/i)).toBeInTheDocument()
        })

        const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
        fireEvent.click(cancelButton)

        await waitFor(() => {
            expect(screen.queryByText(/cookie already exists/i)).not.toBeInTheDocument()
            expect(screen.getByLabelText(/cookie name/i)).toBeInTheDocument()
        })
    })

    it('shows error message for non-duplicate errors', async () => {
        const error = {
            response: { status: 500 },
            message: 'Server error'
        }
        mockOnSubmit.mockRejectedValue(error)

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        fireEvent.change(screen.getByLabelText(/cookie name/i), {
            target: { value: 'test' }
        })
        fireEvent.change(screen.getByLabelText(/domain/i), {
            target: { value: 'example.com' }
        })
        fireEvent.change(screen.getByLabelText(/cookie value/i), {
            target: { value: 'test' }
        })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(screen.getByText(/server error/i)).toBeInTheDocument()
        })
    })

    it('clears form after successful submission', async () => {
        mockOnSubmit.mockResolvedValue()

        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        const nameInput = screen.getByLabelText(/cookie name/i)
        const domainInput = screen.getByLabelText(/domain/i)
        const valueInput = screen.getByLabelText(/cookie value/i)

        fireEvent.change(nameInput, { target: { value: 'test' } })
        fireEvent.change(domainInput, { target: { value: 'example.com' } })
        fireEvent.change(valueInput, { target: { value: 'test' } })

        fireEvent.click(screen.getByRole('button', { name: /add cookie/i }))

        await waitFor(() => {
            expect(nameInput.value).toBe('')
            expect(domainInput.value).toBe('')
            expect(valueInput.value).toBe('')
        })
    })

    it('calls onCancel when cancel button is clicked', () => {
        render(<AddCookieForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
})
