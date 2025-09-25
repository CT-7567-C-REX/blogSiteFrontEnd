'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Editor from '@/components/Editor'
import ImageUploader from '@/components/ImageUploader'
import { getPostBySlug, updatePost, deletePost } from 'services/blog/routes'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImageAlt, setFeaturedImageAlt] = useState('')
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tags = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput]
  )

  useEffect(() => {
    if (!params?.id) return
    let mounted = true
    ;(async () => {
      try {
        const slug = searchParams?.get('slug') || params.id
        const data = await getPostBySlug(slug)
        if (!mounted) return
        const p: any = data?.post || data
        setTitle(p.title || '')
        setContent(p.content || '')
        setFeaturedPreviewUrl(p.featured_image_url || null)
        setFeaturedImageAlt(p.featured_image_alt_text || '')
        const tagNames = Array.isArray(p.tags) ? p.tags.map((t: any) => t?.name).filter(Boolean) : []
        setTagsInput(tagNames.join(', '))
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
  }, [params?.id, searchParams])

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      if (!title || !content) {
        setError('Title and Content are required')
        return
      }
      setSubmitting(true)
      try {
        const updated = await updatePost({
          post_id: params.id,
          title,
          content,
          tags,
          featured_image: featuredImage || undefined,
          featured_image_alt_text: featuredImageAlt || undefined,
        })
        const slug = updated?.slug || updated?.post?.slug || params.id
        router.push(`/blog/${slug}`)
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to update post'
        )
      } finally {
        setSubmitting(false)
      }
    },
    [params.id, title, content, tags, featuredImage, featuredImageAlt, router]
  )

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-8">Loading…</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Post</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium dark:text-gray-300">Featured image</label>
          <ImageUploader
            selectedImage={featuredImage}
            previewUrl={featuredPreviewUrl}
            onImageSelect={(file) => setFeaturedImage(file)}
            onImageRemove={() => {
              setFeaturedImage(null)
              setFeaturedPreviewUrl(null)
            }}
            label=""
            accept="image/*"
            maxSize={8}
          />
          <div className="mt-3">
            <label htmlFor="featured-alt" className="mb-1 block text-sm font-medium dark:text-gray-300">
              Featured image alt text
            </label>
            <input
              id="featured-alt"
              type="text"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Describe the featured image for accessibility"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Post title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Content *
          </label>
          <Editor content={content} onChange={setContent} placeholder="Edit your blog post content..." />
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Comma separated tags"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
              try {
                await deletePost(params.id)
                router.push('/allPosts')
              } catch (e) {
                alert('Failed to delete post')
              }
            }}
            className="ml-auto rounded-md border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}


