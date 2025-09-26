'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Editor from '@/components/Editor'
import ImageUploader from '@/components/ImageUploader'
import { getPostBySlug, updatePost, deletePost } from 'services/blog/routes'
import { v4 as uuidv4 } from 'uuid'

// Utility: Extract both base64 and URL images, convert to File, replace src with filename
async function extractImagesFromContentAll(html: string) {
  // Regex for base64 images
  const base64Regex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g
  // Regex for URL images (http/https)
  const urlRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/g

  let match
  let images: File[] = []
  let newHtml = html

  // 1. Handle base64 images
  while ((match = base64Regex.exec(html))) {
    const base64 = match[1]
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
  }

  // 2. Handle URL images (fetch and convert to File)
  // Use a Set to avoid duplicate URLs
  const urlSet = new Set<string>()
  let urlMatch
  while ((urlMatch = urlRegex.exec(html))) {
    urlSet.add(urlMatch[1])
  }

  const urlPromises = Array.from(urlSet).map(async (url) => {
    // Guess extension from URL or fallback to jpg
    const extMatch = url.match(/\.(\w+)(?:\?|$)/)
    const ext = extMatch ? extMatch[1] : 'jpg'
    const filename = `content_image_${uuidv4()}.${ext}`

    // Fetch image and convert to File
    const res = await fetch(url)
    const blob = await res.blob()
    const file = new File([blob], filename, { type: blob.type || `image/${ext}` })
    images.push(file)
    // Replace all occurrences of this url in HTML with filename
    newHtml = newHtml.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), filename)
  })

  await Promise.all(urlPromises)
  return { html: newHtml, images }
}

// Utility: Download a featured image from a URL and return a File object
async function downloadFeaturedImage(url: string): Promise<File> {
  const extMatch = url.match(/\.(\w+)(?:\?|$)/)
  const ext = extMatch ? extMatch[1] : 'jpg'
  const filename = `featured_image_${uuidv4()}.${ext}`
  const res = await fetch(url)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type || `image/${ext}` })
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
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
        setMetaDescription(p.meta_description || '')
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
        // Extract images (base64 and URLs), convert to File, and replace src in HTML
        const { html: processedContent, images: contentImages } = await extractImagesFromContentAll(content)

        // Download featured image if not changed and previewUrl exists
        let featuredImageToSend: File | undefined = featuredImage || undefined
        if (!featuredImage && featuredPreviewUrl) {
          featuredImageToSend = await downloadFeaturedImage(featuredPreviewUrl)
        }

        const updated = await updatePost({
          post_id: params.id,
          title,
          content: processedContent,
          tags,
          featured_image: featuredImageToSend,
          featured_image_alt_text: featuredImageAlt || undefined,
          meta_description: metaDescription || undefined,
          content_images: contentImages, // include content images
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
    [params.id, title, content, tags, featuredImage, featuredPreviewUrl, featuredImageAlt, metaDescription, router]
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
          <label htmlFor="meta_description" className="mb-1 block text-sm font-medium dark:text-gray-300">
            Description (SEO)
          </label>
          <textarea
            id="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Short summary for search engines and social sharing"
            rows={3}
            maxLength={300}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Up to 300 characters</div>
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


