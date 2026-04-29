import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import PublicRoute from '../PublicRoute'

const renderRoutes = (initialPath, routeElement) => render(
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path={initialPath} element={routeElement} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />
    </Routes>
  </MemoryRouter>
)

describe('auth route guards', () => {
  it('redirects anonymous users away from protected routes', () => {
    renderRoutes('/private', <ProtectedRoute><div>Secret</div></ProtectedRoute>)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders protected children when a token exists', () => {
    sessionStorage.setItem('authToken', 'token')
    renderRoutes('/private', <ProtectedRoute><div>Secret</div></ProtectedRoute>)

    expect(screen.getByText('Secret')).toBeInTheDocument()
  })

  it('redirects authenticated users away from public routes', () => {
    sessionStorage.setItem('authToken', 'token')
    renderRoutes('/login', <PublicRoute><div>Public Login</div></PublicRoute>)

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })

  it('renders public children for anonymous users', () => {
    renderRoutes('/login', <PublicRoute><div>Public Login</div></PublicRoute>)

    expect(screen.getByText('Public Login')).toBeInTheDocument()
  })
})
