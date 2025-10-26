'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Business, SearchFilters } from '@/types/business'
import { PaginatedResult } from '@/services/businessService'
import BusinessGrid from './BusinessGrid'
import Header from './Header'
import { Search, Filter, X, ChevronLeft, ChevronRight, Star, Users, AArrowUp, Calendar } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import BusinessGridLoading from './BusinessGridLoading'

interface SearchClientProps {
  initialData: PaginatedResult
  categories: string[]
  areas: string[]
  initialFilters: SearchFilters
  initialSort: string
  currentPage: number
}

export default function SearchClient({ 
  initialData, 
  categories, 
  areas, 
  initialFilters,
  initialSort,
  currentPage
}: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [data, setData] = useState<PaginatedResult>(initialData)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const updateURL = (newFilters: SearchFilters, newSort: string, newPage: number) => {
    const params = new URLSearchParams()
    
    if (newFilters.query) params.set('query', newFilters.query)
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.area) params.set('area', newFilters.area)
    if (newSort !== 'rating') params.set('sort', newSort)
    if (newPage > 1) params.set('page', newPage.toString())
    
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = async (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setIsLoading(true)
    
    // Reset to page 1 when filters change
    updateURL(newFilters, sortBy, 1)
  }

  const handleSortChange = async (newSort: string) => {
    setSortBy(newSort)
    setIsLoading(true)
    updateURL(filters, newSort, 1)
  }

  const handlePageChange = async (newPage: number) => {
    setIsLoading(true)
    updateURL(filters, sortBy, newPage)
  }

  const clearFilters = async () => {
    const newFilters = { query: '', category: '', area: '' }
    setFilters(newFilters)
    setIsLoading(true)
    updateURL(newFilters, sortBy, 1)
  }

  // Reset loading when navigation completes
  useEffect(() => {
    setIsLoading(false)
  }, [data])

  const hasActiveFilters = filters.query || filters.category || filters.area

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'reviews', label: 'Most Reviews', icon: Users },
    { value: 'name', label: 'Alphabetical', icon: AArrowUp },
    { value: 'newest', label: 'Newest', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Services in Dubai
          </h1>
          <p className="text-gray-600">
            Search through our directory of trusted service providers
          </p>
        </div>

        {/* Search Bar & Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies or services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={isLoading}
              >
                {sortOptions.map(option => {
                  const IconComponent = option.icon
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={filters.area || ''}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: {filters.query}
                    <button
                      onClick={() => handleFilterChange('query', '')}
                      className="ml-2 hover:text-blue-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-2 hover:text-green-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.area && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Area: {filters.area}
                    <button
                      onClick={() => handleFilterChange('area', '')}
                      className="ml-2 hover:text-purple-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                disabled={isLoading}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Clear all
              </button>
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
              `Showing ${data.businesses.length} of ${data.totalCount.toLocaleString()} companies`
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
          <BusinessGridLoading count={20} />
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

        {/* No Results */}
        {!isLoading && data.businesses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clear filters'
                : 'No businesses match your current criteria'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}