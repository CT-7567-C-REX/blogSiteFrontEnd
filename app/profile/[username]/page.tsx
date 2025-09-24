'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getProfileByUsername } from 'services/user/routes'
import { getUserPostsByUsername } from 'services/user/routes'

type Profile = {
  id: string
  username: string
  fullName: string
  email?: string | null
  bio?: string | null
  about?: string | null
  profile_image_url?: string
  created_at: string
  role?: string
  contact_info_visible?: boolean | null
  verified?: boolean
  followers_count?: number
  following_count?: number
  blog_posts_count?: number
  comments_count?: number
  blocked_users_count?: number | null
  saved_posts_count?: number | null
  is_own_profile?: boolean
}

export default function PublicProfilePage() {
  const { username } = useParams() as { username: string }
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!username) return
    let mounted = true
    ;(async () => {
      try {
        const data = await getProfileByUsername(username)
        if (!mounted) return
        setProfile(data)
      } catch (err: any) {
        if (!mounted) return
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [username])

  useEffect(() => {
    if (!username) return
    let mounted = true
    ;(async () => {
      try {
        const data = await getUserPostsByUsername(username, { page, per_page: perPage })
        if (!mounted) return
        setPosts(data?.posts || [])
        const p = data?.pageData
        if (p) setTotalPages(p.pages || 1)
      } catch (err) {
        // keep silent for posts
      }
    })()
    return () => {
      mounted = false
    }
  }, [username, page, perPage])

  if (loading) return <div className="mx-auto mt-10 max-w-3xl px-4">Loading...</div>
  if (error) return <div className="mx-auto mt-10 max-w-3xl px-4 text-red-500">{error}</div>
  if (!profile) return null

  return (
    <div className="mx-auto mt-10 max-w-3xl px-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        {profile.profile_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profile_image_url}
            alt={profile.username}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-600 dark:text-gray-300">@{profile.username}</p>
        </div>
        {profile.is_own_profile && (
          <Link
            href={`/profile/${profile.username}/edit`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Edit Profile
          </Link>
        )}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Posts</h2>
        {posts.length === 0 && (
          <div className="text-gray-600">No posts yet.</div>
        )}
        <ul className="space-y-3">
          {posts.map((post) => (
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
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
