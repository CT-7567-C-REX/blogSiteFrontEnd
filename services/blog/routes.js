import client from '../axios'
import { endpoints } from '../endpoints'

/**
 * Create a new blog post (multipart/form-data)
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.content
 * @param {string=} params.meta_description
 * @param {string=} params.keywords
 * @param {File=} params.featured_image
 * @param {string=} params.featured_image_alt_text
 * @param {File[]=} params.content_images
 * @param {string[]=} params.tags
 * @returns {Promise<any>} server response data
 */
export async function createPost(params) {
  const {
    title,
    content,
    meta_description,
    keywords,
    featured_image,
    featured_image_alt_text,
    content_images,
    tags,
  } = params || {}

  const formData = new FormData()
  if (title != null) formData.append('title', title)
  if (content != null) formData.append('content', content)
  if (meta_description != null) formData.append('meta_description', meta_description)
  if (keywords != null) formData.append('keywords', keywords)
  if (featured_image != null) formData.append('featured_image', featured_image)
  if (featured_image_alt_text != null)
    formData.append('featured_image_alt_text', featured_image_alt_text)

  if (Array.isArray(content_images)) {
    content_images.forEach((file) => {
      if (file) formData.append('content_images', file)
    })
  }

  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      if (tag != null && String(tag).trim().length > 0) {
        formData.append('tags', String(tag).trim())
      }
    })
  }

  const res = await client.post(endpoints.blogPostsCreate, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function getAllPosts() {
  const res = await client.get(endpoints.blogPostsAll)
  return res.data
}

export default { createPost, getAllPosts }
 
/**
 * Get a single blog post by its slug
 * @param {string} slug
 * @returns {Promise<any>} server response data
 */
export async function getPostBySlug(slug) {
  const res = await client.get(endpoints.blogPostBySlug(slug))
  return res.data
}

export const blog = { createPost, getAllPosts, getPostBySlug }


