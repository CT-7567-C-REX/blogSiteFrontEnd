import Main from './Main'

type Post = {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
}

async function fetchMockedPosts(): Promise<Post[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)) // simulate delay

    return [
      {
        slug: 'hello-world',
        date: '2025-07-18',
        title: 'Hello World',
        summary: 'This is a test blog post about saying hello to the world.',
        tags: ['intro', 'test'],
      },
      {
        slug: 'nextjs-tips',
        date: '2025-07-17',
        title: 'Top 5 Next.js Tips',
        summary: 'Learn some cool tips to improve your Next.js apps.',
        tags: ['nextjs', 'productivity'],
      },
      {
        slug: 'tailwind-secrets',
        date: '2025-07-16',
        title: 'Tailwind Secrets',
        summary: 'Some hidden gems in Tailwind CSS you probably missed.',
        tags: ['tailwind', 'css'],
      },
      {
        slug: 'pliny-review',
        date: '2025-07-15',
        title: 'Pliny Starter Review',
        summary: 'What we think about the Pliny starter blog.',
        tags: ['review', 'pliny'],
      },
      {
        slug: 'my-backend-plan',
        date: '2025-07-14',
        title: 'My Backend Plan',
        summary: 'How I’m building my own backend for blog posts.',
        tags: ['backend', 'plan'],
      },
      {
        slug: 'deploying-to-vercel',
        date: '2025-07-13',
        title: 'Deploying to Vercel',
        summary: 'A quick walkthrough of deploying your app to Vercel.',
        tags: ['vercel', 'deploy'],
      },
    ]
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export default async function Page() {
  const posts = await fetchMockedPosts()
  return <Main posts={posts} />
}
