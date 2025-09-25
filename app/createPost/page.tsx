'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from 'services/blog/routes'
import Editor from '@/components/Editor'
import ImageUploader from '@/components/ImageUploader'

export default function CreatePostPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
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

  const fillWithMockData = useCallback(() => {
    setTitle('Kediler: Evimizin Zarif Dostları')
    setContent(
      `
      <h2>Kediler Hakkında</h2>
      <p>Kediler binlerce yıldır insanlarla birlikte yaşayan, bağımsız ama bir o kadar da sevgi dolu canlılardır. Sessiz adımları, meraklı bakışları ve oyuncu tavırlarıyla hayatımıza neşe katarlar.</p>
      <h3>Bakım İpuçları</h3>
      <ul>
        <li>Dengeli bir beslenme düzeni oluşturun.</li>
        <li>Temiz suyu her zaman erişilebilir kılın.</li>
        <li>Düzenli tarama ve tırnak bakımı yapın.</li>
        <li>Kum kabını temiz tutun.</li>
      </ul>
      <p>Kedinizle oyun oynamak, onun hem fiziksel hem de zihinsel sağlığı için çok önemlidir. Basit bir tüy oyuncak bile saatlerce eğlence sağlayabilir.</p>
      <blockquote>"Kediler asla sıradan değildir; her biri ayrı bir karaktere sahiptir."</blockquote>
      <p>Yeni bir kedi sahiplenecekseniz sabırlı olun ve onun yeni ortamına alışması için zaman tanıyın.</p>
      `
    )
    setTagsInput('kediler, evcil hayvanlar, bakım')
    if (featuredImage == null) {
      setFeaturedImageAlt('Pencere kenarında oturan meraklı bir kedi')
    }
  }, [featuredImage])

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
          tags,
          featured_image: featuredImage || undefined,
          featured_image_alt_text: featuredImageAlt || undefined,
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
        <button
            type="button"
            onClick={fillWithMockData}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            title="Mock data ile doldur"
          >
            Mock data ekle (kediler)
          </button>
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
