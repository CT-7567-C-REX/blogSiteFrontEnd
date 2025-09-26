import client from '../axios'
import { endpoints } from '../endpoints'

/**
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.content
 * @param {string[]=} params.tags
 * @param {File=} params.featured_image
 * @param {string=} params.featured_image_alt_text
 * @param {string=} params.meta_description
 * @param {File[]=} params.content_images
 */
export async function createPost(params) {
  const {
    title,
    content,
    tags,
    featured_image,
    featured_image_alt_text,
    meta_description,
    content_images,
  } = params || {}

  const formData = new FormData()
  if (title != null) formData.append('title', title)
  if (content != null) formData.append('content', content)
  if (meta_description != null) formData.append('meta_description', meta_description)
  if (featured_image != null) formData.append('featured_image', featured_image)
  if (featured_image_alt_text != null)
    formData.append('featured_image_alt_text', featured_image_alt_text)

  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      if (tag != null && String(tag).trim().length > 0) {
        formData.append('tags', String(tag).trim())
      }
    })
  }

  // Add content images
  if (Array.isArray(content_images)) {
    content_images.forEach((img) => {
      formData.append('content_images', img)
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

/**
 * Update an existing blog post (multipart/form-data)
 * Params are the same as create; only provided fields will be updated.
 * @param {Object} params
 * @param {string} params.post_id
 * @param {string=} params.title
 * @param {string=} params.content
 * @param {string[]=} params.tags
 * @param {File=} params.featured_image
 * @param {string=} params.featured_image_alt_text
 * @param {string=} params.meta_description
 * @param {File[]=} params.content_images
 */
export async function updatePost(params) {
  const {
    post_id,
    title,
    content,
    tags,
    featured_image,
    featured_image_alt_text,
    meta_description,
    content_images,
  } = params || {}

  const formData = new FormData()
  if (title != null) formData.append('title', title)
  if (content != null) formData.append('content', content)
  if (meta_description != null) formData.append('meta_description', meta_description)
  if (featured_image != null) formData.append('featured_image', featured_image)
  if (featured_image_alt_text != null) formData.append('featured_image_alt_text', featured_image_alt_text)
  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      if (tag != null && String(tag).trim().length > 0) {
        formData.append('tags', String(tag).trim())
      }
    })
  }
  // Add content images
  if (Array.isArray(content_images)) {
    content_images.forEach((img) => {
      formData.append('content_images', img)
    })
  }
  const res = await client.post(endpoints.blogPostEdit(post_id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const edit = { updatePost }

/**
 * Delete a blog post by id
 * @param {string} post_id
 */
export async function deletePost(post_id) {
  const res = await client.delete(endpoints.blogPostDelete(post_id))
  return res.data
}

export const remove = { deletePost }


