import client from '../axios'
import { endpoints } from '../endpoints'
import { currentUsername } from '../session'

export async function getProfile() {
  // Backend needs username; pull from stored session
  const username = currentUsername()
  const res = await client.get(endpoints.userProfileByUsername(username))
  return res.data
}

export async function getProfileByUsername(username) {
  const res = await client.get(endpoints.userProfileByUsername(username))
  return res.data
}

/**
 * Get posts of a user by username with pagination
 * @param {string} username
 * @param {{ page?: number, per_page?: number }} [params]
 */
export async function getUserPostsByUsername(username, params = {}) {
  const { page, per_page } = params || {}
  const res = await client.get(endpoints.userPostsByUsername(username), {
    params: { page, per_page },
  })
  return res.data
}

/**
 * Update user profile picture
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<any>} server response data
 */
export async function updateProfilePicture(imageFile) {
  const formData = new FormData()
  formData.append('profilePic', imageFile)

  const res = await client.post(endpoints.updateProfilePicture, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

/**
 * Remove user profile picture
 * @returns {Promise<any>} server response data
 */
export async function removeProfilePicture() {
  const formData = new FormData()
  // Send empty FormData to trigger DELETE case in backend

  const res = await client.post(endpoints.updateProfilePicture, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export default { getProfile, getProfileByUsername, updateProfilePicture, removeProfilePicture, getUserPostsByUsername }


