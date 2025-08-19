'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import client from 'services/axios'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await client.post('/auth/register', {
        username,
        email,
        password,
      })

      const { access_token, refresh_token } = res.data || {}

      if (access_token && refresh_token) {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        router.push('/')
      } else {
        router.push('/login')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <h1 className="mb-6 text-2xl font-bold text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-primary-500 px-4 py-2 font-semibold text-white hover:bg-primary-600"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account?</span>
          <Link
            href="/login"
            className="ml-2 inline-block rounded border border-primary-500 px-4 py-2 font-semibold text-primary-600 hover:bg-primary-50"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}


