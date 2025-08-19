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

export default { getProfile, getProfileByUsername }


