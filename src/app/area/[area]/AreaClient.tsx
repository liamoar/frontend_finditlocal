'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Business } from '@/types/business'
import { PaginatedResult } from '@/services/businessService'
import BusinessGrid from '@/components/BusinessGrid'
import { Filter, X, ChevronLeft, ChevronRight, Star, Users, AArrowUp, Calendar } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import BusinessGridLoading from '@/components/BusinessGridLoading'

interface AreaClientProps {
  initialData: PaginatedResult
  categories: string[]
  area: string
  currentPage: number
  currentSort: string
  currentCategory: string
}

export default function AreaClient({ 
  initialData, 
  categories, 
  area, 
  currentPage, 
  currentSort, 
  currentCategory 
}: AreaClientProps) {
  const router = useRouter()
  const [data, setData] = useState<PaginatedResult>(initialData)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)
  const [sortBy, setSortBy] = useState(currentSort)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  console.log('AreaClient Render:', { 
    currentPage, 
    currentSort, 
    currentCategory, 
    isLoading,
    businessesCount: data.businesses.length 
  })

  // Reset loading state when new data arrives
  useEffect(() => {
    console.log('useEffect - updating state from props')
    setData(initialData)
    setSelectedCategory(currentCategory)
    setSortBy(currentSort)
    setIsLoading(false) // CRITICAL: Reset loading when new data arrives
  }, [initialData, currentCategory, currentSort])

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.warn('Loading timeout - resetting state')
        setIsLoading(false)
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeoutId)
    }
  }, [isLoading])

  const updateURL = (category: string, sort: string, page: number) => {
    console.log('updateURL called:', { category, sort, page })
    setIsLoading(true)
    
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort !== 'rating') params.set('sort', sort)
    if (page > 1) params.set('page', page.toString())
    
    const url = `/area/${encodeURIComponent(area)}${params.toString() ? `?${params.toString()}` : ''}`
    console.log('Navigating to:', url)
    router.push(url, { scroll: false })
  }

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    updateURL(category, sortBy, 1)
  }

  const handleSortChange = async (sort: string) => {
    setSortBy(sort)
    updateURL(selectedCategory, sort, 1)
  }

  const handlePageChange = async (page: number) => {
    updateURL(selectedCategory, sortBy, page)
  }

  const clearCategoryFilter = () => {
    handleCategoryChange('')
  }

  const hasActiveFilter = selectedCategory

  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'reviews', label: 'Most Reviews', icon: Users },
    { value: 'name', label: 'Alphabetical', icon: AArrowUp },
    { value: 'newest', label: 'Newest', icon: Calendar },
  ]

  return (
    <div>
      {/* Header with Stats and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Local Services in {area}, Dubai
            </h1>
            <p className="text-gray-600 mb-2">
              {data.totalCount.toLocaleString()} service providers in {area}
              {selectedCategory && ` • ${data.businesses.length} in ${formatCategoryName(selectedCategory)}`}
            </p>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={isLoading}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filter by Category</span>
            </button>
          </div>
        </div>

        {/* Expandable Category Filter */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Category:
              </label>
              <select 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Categories in {area}</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filter */}
        {hasActiveFilter && (
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Active filter:</span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Category: {formatCategoryName(selectedCategory)}
                <button 
                  onClick={clearCategoryFilter} 
                  disabled={isLoading}
                  className="ml-2 hover:text-blue-600 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Loading services...</span>
            </div>
          ) : (
            `Showing ${data.businesses.length} of ${data.totalCount.toLocaleString()} ${selectedCategory ? formatCategoryName(selectedCategory).toLowerCase() : 'service'} providers in ${area}`
          )}
        </h2>

        {/* Page Info */}
        {data.totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {data.currentPage} of {data.totalPages}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <BusinessGridLoading count={12} />
      ) : (
        <>
          <BusinessGrid businesses={data.businesses} />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8 pt-6 border-t border-gray-200">
              {/* Previous Button */}
              <button 
                onClick={() => handlePageChange(data.currentPage - 1)}
                disabled={!data.hasPrevPage || isLoading}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let pageNum
                  if (data.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (data.currentPage <= 3) {
                    pageNum = i + 1
                  } else if (data.currentPage >= data.totalPages - 2) {
                    pageNum = data.totalPages - 4 + i
                  } else {
                    pageNum = data.currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`px-3 py-2 border rounded-lg min-w-[40px] ${
                        data.currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              {/* Next Button */}
              <button 
                onClick={() => handlePageChange(data.currentPage + 1)}
                disabled={!data.hasNextPage || isLoading}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}