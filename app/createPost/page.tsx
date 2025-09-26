'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from 'services/blog/routes'
import Editor from '@/components/Editor'
import ImageUploader from '@/components/ImageUploader'
import { v4 as uuidv4 } from 'uuid' // install uuid if not present

// Utility to extract base64 images and replace with filenames
function extractImagesFromContent(html: string) {
  const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g
  let match
  let images: File[] = []
  let newHtml = html
  let idx = 0

  while ((match = imgRegex.exec(html))) {
    const base64 = match[1]
    // Get extension
    const extMatch = /^data:image\/(\w+);base64,/.exec(base64)
    const ext = extMatch ? extMatch[1] : 'png'
    const filename = `content_image_${uuidv4()}.${ext}`

    // Convert base64 to File
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    const file = new File([u8arr], filename, { type: mime })
    images.push(file)

    // Replace base64 src with filename in HTML
    newHtml = newHtml.replace(base64, filename)
    idx++
  }

  return { html: newHtml, images }
}

export default function CreatePostPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImageAlt, setFeaturedImageAlt] = useState('')

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
        // Extract images from content
        const { html: processedContent, images: contentImages } = extractImagesFromContent(content)

        const created = await createPost({
          title,
          content: processedContent,
          tags,
          featured_image: featuredImage || undefined,
          featured_image_alt_text: featuredImageAlt || undefined,
          meta_description: metaDescription || undefined,
          content_images: contentImages, // pass array of images
        })
        const slug = created?.slug || created?.post?.slug
        if (slug) router.push(`/blog/${slug}`)
        else router.push('/allPosts')
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to create post'
        )
      } finally {
        setSubmitting(false)
      }
    },
    [
      title,
      content,
      tags,
      router,
      featuredImage,
      featuredImageAlt,
      metaDescription,
    ]
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
          <label htmlFor="meta_description" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Description (SEO)
          </label>
          <input
            id="meta_description"
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value) }
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Post title"
            maxLength={300}
            required
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Up to 300 characters</div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Featured image
          </label>
          <ImageUploader
            selectedImage={featuredImage}
            onImageSelect={(file) => setFeaturedImage(file)}
            onImageRemove={() => setFeaturedImage(null)}
            label=""
            className=""
            accept="image/*"
            maxSize={8}
          />
          <div className="mt-3">
            <label htmlFor="featured-alt" className="mb-1 block text-sm font-medium">
              Featured image alt text
            </label>
            <input
              id="featured-alt"
              type="text"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Describe the featured image for accessibility"
              disabled={!featuredImage}
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Content *
          </label>
          <Editor
            content={content}
            onChange={setContent}
            placeholder="Write your blog post content..."
          />
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
