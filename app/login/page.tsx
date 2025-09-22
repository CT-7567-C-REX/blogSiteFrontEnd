'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login as loginRequest } from 'services/auth/routes'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await loginRequest(emailOrUsername, password)
      if (success) router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="mb-1 block font-medium">Email or Username</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 w-full rounded px-4 py-2 font-semibold text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account?</span>
          <Link
            href="/register"
            className="border-primary-500 text-primary-600 hover:bg-primary-50 ml-2 inline-block rounded border px-4 py-2 font-semibold"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  )
}
