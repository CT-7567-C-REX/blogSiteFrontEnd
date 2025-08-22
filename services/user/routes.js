import client from '../axios'
import { endpoints } from '../endpoints'

export async function getProfile() {
  const res = await client.get(endpoints.userProfile)
  return res.data
}

export async function getProfileByUsername(username) {
  const res = await client.get(endpoints.userProfileByUsername(username))
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

export default { getProfile, getProfileByUsername, updateProfilePicture, removeProfilePicture }


