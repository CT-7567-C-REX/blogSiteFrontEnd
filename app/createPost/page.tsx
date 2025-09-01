"use client"

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from 'services/blog/routes'

export default function CreatePostPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null as File | null)
  const [featuredImageAlt, setFeaturedImageAlt] = useState('')
  const [contentImages, setContentImages] = useState([] as File[])
  const [tagsInput, setTagsInput] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tags = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput]
  )

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
        const created = await createPost({
          title,
          content,
          meta_description: metaDescription,
          keywords,
          featured_image: featuredImage ?? undefined,
          featured_image_alt_text: featuredImageAlt,
          content_images: contentImages,
          tags,
        })
        const slug = created?.slug || created?.post?.slug
        if (slug) router.push(`/blog/${slug}`)
        else router.push('/allPosts')
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to create post')
      } finally {
        setSubmitting(false)
      }
    },
    [title, content, metaDescription, keywords, featuredImage, featuredImageAlt, contentImages, tags, router]
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create Post</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Post title"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-56 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Write your contents..."
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Meta Description</label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Short description for SEO"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Comma separated keywords"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files?.[0] ?? null)}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Featured Image Alt Text</label>
          <input
            type="text"
            value={featuredImageAlt}
            onChange={(e) => setFeaturedImageAlt(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Describe the featured image"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Content Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setContentImages(Array.from(e.target.files ?? []))}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Comma separated tags"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}


