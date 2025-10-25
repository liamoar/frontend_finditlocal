'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Business } from '@/types/business'
import BusinessGrid from './BusinessGrid'
import Header from './Header'
import { Search, Filter, X } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import BusinessGridLoading from './BusinessGridLoading'

interface SearchClientProps {
  initialBusinesses: Business[]
  categories: string[]
  areas: string[]
  initialFilters: {
    query?: string
    category?: string
    area?: string
  }
}

export default function SearchClient({ 
  initialBusinesses, 
  categories, 
  areas, 
  initialFilters 
}: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses)
  const [filters, setFilters] = useState({
    query: initialFilters.query || '',
    category: initialFilters.category || '',
    area: initialFilters.area || ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setBusinesses(initialBusinesses)
  }, [initialBusinesses])

  const handleFilterChange = async (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setIsLoading(true)
    
    const params = new URLSearchParams()
    if (newFilters.query) params.set('query', newFilters.query)
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.area) params.set('area', newFilters.area)
    
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  const clearFilters = async () => {
    setFilters({ query: '', category: '', area: '' })
    setIsLoading(true)
    router.push('/search', { scroll: false })
  }

  // Reset loading when navigation completes
  useEffect(() => {
    setIsLoading(false)
  }, [businesses])

  const hasActiveFilters = filters.query || filters.category || filters.area

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Cleaning & Moving Companies
          </h1>
          <p className="text-gray-600">
            Search through our directory of trusted service providers in Dubai
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
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
                value={filters.category}
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
                value={filters.area}
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
            <div className="mt-4 flex items-center space-x-4">
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

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Loading companies...</span>
                </div>
              ) : (
                `${businesses.length} companies found`
              )}
            </h2>
          </div>
          
          {isLoading ? (
            <BusinessGridLoading count={6} />
          ) : (
            <BusinessGrid businesses={businesses} />
          )}
        </div>
      </div>
    </div>
  )
}