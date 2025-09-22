'use client'

import { useEffect, useState } from 'react'
import { getProfile } from 'services/user/routes'
import Link from 'next/link'
import ClickableProfilePicture from '@/components/ClickableProfilePicture'
import ProfilePictureModal from '@/components/ProfilePictureModal'

type Profile = {
  id: string
  username: string
  fullName: string
  email: string
  bio?: string
  about?: string
  profile_image_url?: string
  created_at: string
  role: string
  contact_info_visible: boolean
  verified: boolean
  followers_count: number
  following_count: number
  blog_posts_count: number
  comments_count: number
  blocked_users_count: number
  saved_posts_count: number
  posts?: Post[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getProfile()
        setProfile(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  if (loading) return <div className="mx-auto mt-10 max-w-3xl px-4">Loading...</div>
  if (error) return <div className="mx-auto mt-10 max-w-3xl px-4 text-red-500">{error}</div>
  if (!profile) return null

  return (
    <div className="mx-auto mt-10 max-w-3xl px-4">
      <div className="flex items-center gap-4">
        <ClickableProfilePicture
          imageUrl={profile.profile_image_url}
          username={profile.username}
          size="md"
          onClick={() => setIsModalOpen(true)}
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-600 dark:text-gray-300">@{profile.username}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Followers" value={profile.followers_count} />
        <Stat label="Following" value={profile.following_count} />
        <Stat label="Posts" value={profile.blog_posts_count} />
        <Stat label="Comments" value={profile.comments_count} />
        <Stat label="Blocked" value={profile.blocked_users_count} />
        <Stat label="Saved" value={profile.saved_posts_count} />
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImageUrl={profile.profile_image_url}
        onImageUpdate={() => {
          // Refresh the profile data to get the updated image URL
          const refreshProfile = async () => {
            try {
              const updatedProfile = await getProfile()
              setProfile(updatedProfile)
            } catch (err: any) {
              console.error('Failed to refresh profile:', err)
            }
          }
          refreshProfile()
          // Close modal after successful update
          setIsModalOpen(false)
        }}
      />

      <div className="mt-8 space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
        <div>{profile.email}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Role</div>
        <div>{profile.role}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Verified</div>
        <div>{profile.verified ? 'Yes' : 'No'}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Contact Info Visible</div>
        <div>{profile.contact_info_visible ? 'Yes' : 'No'}</div>
      </div>

      {(profile.bio || profile.about) && (
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">About</h2>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">
            {profile.about || profile.bio}
          </p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Joined on {new Date(profile.created_at).toLocaleDateString()}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">My Posts</h2>
        {(!profile.posts || profile.posts.length === 0) && (
          <div className="text-gray-600">You haven't written any posts yet.</div>
        )}
        <ul className="space-y-3">
          {(profile.posts || []).map((post) => (
            <li key={post.id} className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Link href={`/blog/${post.slug}`} className="text-lg font-medium hover:underline">
                    {post.title}
                  </Link>
                  {post.created_at && (
                    <div className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-gray-200 p-3 text-center dark:border-gray-700">
      <div className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {label}
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}

type Post = {
  id: string
  title: string
  content?: string
  created_at?: string
  updated_at?: string
  slug: string
  user_id?: string
  author?: { id: string; username: string }
}
