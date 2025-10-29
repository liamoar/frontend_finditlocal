'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Business } from '@/types/business'
import { PaginatedResult } from '@/services/businessService'
import BusinessGrid from '@/components/BusinessGrid'
import { Filter, X, ChevronLeft, ChevronRight, Star, Users, AArrowUp, Calendar } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import BusinessGridLoading from '@/components/BusinessGridLoading'

interface CategoryClientProps {
  initialData: PaginatedResult
  areas: string[]
  category: string
  currentPage: number
  currentSort: string
  currentArea: string
  areaCounts: Record<string, number>
}

export default function CategoryClient({ 
  initialData, 
  areas, 
  category, 
  currentPage, 
  currentSort, 
  currentArea,
  areaCounts 
}: CategoryClientProps) {
  const router = useRouter()
  const [data, setData] = useState<PaginatedResult>(initialData)
  const [selectedArea, setSelectedArea] = useState(currentArea)
  const [sortBy, setSortBy] = useState(currentSort)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  console.log('CategoryClient Render:', { 
    currentPage, 
    currentSort, 
    currentArea, 
    isLoading,
    businessesCount: data.businesses.length,
    totalCount: data.totalCount
  })

  // Reset loading state when new data arrives
  useEffect(() => {
    console.log('useEffect - updating state from props')
    setData(initialData)
    setSelectedArea(currentArea)
    setSortBy(currentSort)
    setIsLoading(false)
  }, [initialData, currentArea, currentSort])

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.warn('Loading timeout - resetting state')
        setIsLoading(false)
      }, 10000)

      return () => clearTimeout(timeoutId)
    }
  }, [isLoading])

  const updateURL = (area: string, sort: string, page: number) => {
    console.log('updateURL called:', { area, sort, page })
    setIsLoading(true)
    
    const params = new URLSearchParams()
    if (area) params.set('area', area)
    if (sort !== 'rating') params.set('sort', sort)
    if (page > 1) params.set('page', page.toString())
    
    const url = `/category/${encodeURIComponent(category)}${params.toString() ? `?${params.toString()}` : ''}`
    console.log('Navigating to:', url)
    router.push(url, { scroll: false })
  }

  const handleAreaChange = async (area: string) => {
    setSelectedArea(area)
    updateURL(area, sortBy, 1)
  }

  const handleSortChange = async (sort: string) => {
    setSortBy(sort)
    updateURL(selectedArea, sort, 1)
  }

  const handlePageChange = async (page: number) => {
    updateURL(selectedArea, sortBy, page)
  }

  const clearAreaFilter = () => {
    handleAreaChange('')
  }

  const hasActiveFilter = selectedArea

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

  // Calculate area counts for display
  const filteredAreaCounts = areas
    .map(area => ({
      area,
      count: areaCounts[area] || 0
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count) // Sort by count descending

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
              {formatCategoryName(category)} Services in Dubai
            </h1>
            <p className="text-gray-600 mb-2">
              {data.totalCount.toLocaleString()} service providers in Dubai
              {selectedArea && ` • ${data.businesses.length} in ${selectedArea}`}
            </p>
            
            {/* Area Counts - Only show when no area filter is active */}
            {!selectedArea && filteredAreaCounts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filteredAreaCounts.slice(0, 8).map(({ area, count }) => (
                  <button 
                    key={area} 
                    onClick={() => handleAreaChange(area)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    {area}
                    <span className="ml-1 bg-green-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-[20px]">
                      {count}
                    </span>
                  </button>
                ))}
                {filteredAreaCounts.length > 8 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                    +{filteredAreaCounts.length - 8} more areas
                  </span>
                )}
              </div>
            )}
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
              <span>Filter by Area</span>
            </button>
          </div>
        </div>

        {/* Expandable Area Filter */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Area:
              </label>
              <select 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Areas in Dubai</option>
                {filteredAreaCounts.map(({ area, count }) => (
                  <option key={area} value={area}>
                    {area} ({count})
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Area: {selectedArea}
                <button 
                  onClick={clearAreaFilter} 
                  disabled={isLoading}
                  className="ml-2 hover:text-green-600 disabled:opacity-50"
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
              <span>Loading companies...</span>
            </div>
          ) : (
            `Showing ${((data.currentPage - 1) * 12) + 1}-${Math.min(data.currentPage * 12, data.totalCount)} of ${data.totalCount.toLocaleString()} ${formatCategoryName(category).toLowerCase()} service providers${selectedArea ? ` in ${selectedArea}` : ' across Dubai'}`
          )}
        </h2>

        {/* Page Info - Only show if there are multiple pages */}
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

          {/* Pagination - Only show if there are multiple pages */}
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