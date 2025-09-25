import Main from './Main'
import { getAllPosts } from 'services/blog/routes'

export default async function Page() {
  // SSR-friendly: getAllPosts uses axios with baseURL; if needed, can proxy via /api
  try {
    const posts = await getAllPosts()
    return <Main posts={posts || []} />
  } catch (e) {
    return <Main posts={[]} />
  }
}
