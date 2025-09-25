'use client'

import { useEffect, useMemo, useState } from 'react'
import { getProfile } from 'services/user/routes'
import ClickableProfilePicture from '@/components/ClickableProfilePicture'
import ProfilePictureModal from '@/components/ProfilePictureModal'

type TabKey = 'profile' | 'account' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const [isPicModalOpen, setIsPicModalOpen] = useState(false)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const run = async () => {
      try {
        const me = await getProfile()
        setFullName(me?.fullName || '')
        setUsername(me?.username || '')
        setEmail(me?.email || '')
        setProfileImageUrl(me?.profile_image_url)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const tabs: { key: TabKey; label: string }[] = useMemo(
    () => [
      { key: 'profile', label: 'Profile' },
      { key: 'account', label: 'Account' },
      { key: 'security', label: 'Security' },
    ],
    []
  )

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire up API to save profile details
    // For now, just noop
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="md:col-span-3">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                  activeTab === t.key
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="md:col-span-9">
          {loading ? (
            <div>Loading…</div>
          ) : activeTab === 'profile' ? (
            <form onSubmit={onSaveProfile} className="space-y-6">
              <div className="flex items-center gap-4">
                <ClickableProfilePicture
                  imageUrl={profileImageUrl}
                  username={username}
                  size="lg"
                  onClick={() => setIsPicModalOpen(true)}
                />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Profile Picture</div>
                  <div className="text-xs text-gray-500">Click to change</div>
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="mb-1 block text-sm font-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Your username"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium">
                    Current password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>

              <ProfilePictureModal
                isOpen={isPicModalOpen}
                onClose={() => setIsPicModalOpen(false)}
                currentImageUrl={profileImageUrl}
                onImageUpdate={() => {
                  // Refresh tiny bit by re-fetching profile image
                  const refresh = async () => {
                    try {
                      const me = await getProfile()
                      setProfileImageUrl(me?.profile_image_url)
                    } catch {}
                  }
                  refresh()
                  setIsPicModalOpen(false)
                }}
              />
            </form>
          ) : activeTab === 'account' ? (
            <div className="text-sm text-gray-600">Account settings coming soon…</div>
          ) : (
            <div className="text-sm text-gray-600">Security settings coming soon…</div>
          )}
        </section>
      </div>
    </div>
  )
}


