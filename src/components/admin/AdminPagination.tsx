import Link from 'next/link'

interface AdminPaginationProps {
  basePath: string
  q: string
  page: number
  totalPages: number
  total: number
}

export default function AdminPagination({ basePath, q, page, totalPages, total }: AdminPaginationProps) {
  const href = (p: number) =>
    `${basePath}?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`
  const linkClass = 'px-3 py-1.5 border rounded-lg bg-white hover:bg-gray-50'

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span className="text-gray-500">
        {total} {total === 1 ? 'result' : 'results'}
        {totalPages > 1 && ` · page ${page} of ${totalPages}`}
      </span>
      {totalPages > 1 && (
        <div className="flex gap-2">
          {page > 1 && <Link href={href(page - 1)} className={linkClass}>Previous</Link>}
          {page < totalPages && <Link href={href(page + 1)} className={linkClass}>Next</Link>}
        </div>
      )}
    </div>
  )
}
