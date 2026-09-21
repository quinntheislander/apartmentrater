import { Search } from 'lucide-react'

/** Plain GET form: the search term lives in ?q= so results are linkable. */
export default function AdminSearch({ q, placeholder }: { q: string; placeholder: string }) {
  return (
    <form method="get" className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <input
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          aria-label="Search"
          className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  )
}
