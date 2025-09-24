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
  featured_image_url?: string
  featured_image_alt_text?: string
  is_owner?: boolean
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
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.featured_image_alt_text || post.title}
          className="mb-6 h-64 w-full rounded-lg object-cover"
        />
      )}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.is_owner && (
          <Link
            href={`/editPost/${post.id}?slug=${encodeURIComponent(post.slug)}`}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
        )}
      </div>
      {post.created_at && (
        <p className="mb-6 text-xs text-gray-500">
          Published: {new Date(post.created_at).toLocaleString()}
        </p>
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
      {post.author?.username && (
        <p className="mt-8 text-sm text-gray-600">
          by{' '}
          <Link href={`/profile/${post.author.username}`} className="hover:underline">
            {post.author.username}
          </Link>
        </p>
      )}
    </article>
  )
}
