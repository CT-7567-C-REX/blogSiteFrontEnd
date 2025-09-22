'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug } from 'services/blog/routes'

type Post = {
  id: string
  title: string
  content?: string
  slug: string
  created_at?: string
  updated_at?: string
  author?: { id: string; username: string }
}

export default function BlogPostPage() {
  const params = useParams() as { slug: string }
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.slug) return
    let mounted = true
    ;(async () => {
      try {
        const data = await getPostBySlug(params.slug)
        if (!mounted) return
        // Expecting either the post directly or { post }
        const p: Post = data?.post || data
        setPost(p)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || 'Failed to load post')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [params?.slug])

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-8">Loading…</div>
  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
        <button onClick={() => router.push('/allPosts')} className="text-blue-600 hover:underline">
          Back to all posts
        </button>
      </div>
    )
  if (!post) return null

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <Link href="/allPosts" className="text-blue-600 hover:underline">
          All posts
        </Link>
      </div>
      {post.author?.username && (
        <p className="mb-4 text-sm text-gray-600">
          by{' '}
          <Link href={`/profile/${post.author.username}`} className="hover:underline">
            {post.author.username}
          </Link>
        </p>
      )}
      {post.created_at && (
        <p className="mb-6 text-xs text-gray-500">
          Published: {new Date(post.created_at).toLocaleString()}
        </p>
      )}
      <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
    </article>
  )
}
