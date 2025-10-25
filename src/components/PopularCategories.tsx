import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PopularCategoriesProps {
  categories: string[]
}

export default function PopularCategories({ categories }: PopularCategoriesProps) {
  const popularCategories = categories.slice(0, 12) // Show more categories now

  // Format category names for display
  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Service Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through Dubai's most trusted local service providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularCategories.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="group bg-gray-50 rounded-lg p-6 hover:bg-blue-50 hover:shadow-md transition-all duration-200 border border-transparent hover:border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 mb-2 capitalize">
                    {formatCategoryName(category)}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600">
                    View service providers
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {categories.length > 12 && (
          <div className="text-center mt-8">
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Service Categories
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}