import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

type PostListItemProps = {
  slug: string
  title: string
  date?: string | null
  summary?: string | null
  tags?: (string | { name: string })[] | null
  featured_image_url?: string | null
}

export default function PostListItem({ slug, title, date, summary, tags, featured_image_url }: PostListItemProps) {
  const normalizedTags = (tags || []).map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean) as string[]
  const hasTags = normalizedTags.length > 0
  const hasSummary = Boolean(summary)
  const hasDate = Boolean(date)

  return (
    <li className="py-6">
      <article>
        <div className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 sm:col-span-3">
            <Link href={`/blog/${slug}`} aria-label={title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured_image_url || '/static/images/twitter-card.png'}
                alt={title}
                className="h-24 w-full rounded-md object-cover sm:h-28"
              />
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-7 space-y-3">
            <h2 className="text-xl font-bold tracking-tight">
              <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                {title}
              </Link>
            </h2>
            {hasTags && (
              <div className="flex flex-wrap">
                {normalizedTags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
            {hasSummary && (
              <div className="prose max-w-none text-gray-500 dark:text-gray-400 line-clamp-2">
                {summary}
              </div>
            )}
            <div className="text-base leading-6 font-medium">
              <Link
                href={`/blog/${slug}`}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={`Read more: "${title}"`}
              >
                Read more →
              </Link>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-2 flex items-start justify-end">
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {hasDate && (
                <time dateTime={date || undefined}>{formatDate(date as string, siteMetadata.locale)}</time>
              )}
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}


