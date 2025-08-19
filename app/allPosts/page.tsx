"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPosts } from 'services/blog/routes'

type Post = {
  id: string
  title: string
  content?: string
  created_at?: string
  updated_at?: string
  slug?: string
  user_id?: string
  author?: { id: string; username: string }
  featured_image?: string
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getAllPosts()
        if (!mounted) return
        const items: Post[] = data?.posts || []
        setPosts(items)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || 'Failed to load posts')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Link
          href="/createPost"
          className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          New Post
        </Link>
      </div>

      {loading && <div className="text-gray-600">Loading…</div>}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-gray-600">No posts found.</div>
      )}

      <ul className="space-y-4">
        {posts.map((post) => {
          const href = post.slug ? `/blog/${post.slug}` : '#'
          return (
            <li key={String(post.id ?? post.slug ?? Math.random())} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {href !== '#' ? (
                      <Link href={href} className="hover:underline">
                        {post.title || 'Untitled'}
                      </Link>
                    ) : (
                      post.title || 'Untitled'
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {post.author?.username ? (
                      <Link href={`/profile/${post.author.username}`} className="hover:underline">
                        by {post.author.username}
                      </Link>
                    ) : null}
                  </p>
                </div>
                {post.featured_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featured_image}
                    alt={post.title || 'featured image'}
                    className="h-16 w-16 flex-shrink-0 rounded object-cover"
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


