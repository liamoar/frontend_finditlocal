'use client'

import { useState, useEffect } from 'react'
import { Business } from '@/types/business'
import BusinessGrid from '@/components/BusinessGrid'
import { Filter, X } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import BusinessGridLoading from '@/components/BusinessGridLoading'

interface AreaClientProps {
  initialBusinesses: Business[]
  categories: string[]
  area: string
}

export default function AreaClient({ 
  initialBusinesses, 
  categories, 
  area 
}: AreaClientProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setBusinesses(initialBusinesses)
  }, [initialBusinesses])

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    setIsLoading(true)
    
    // Update URL without navigation for better UX
    const newUrl = `/area/${encodeURIComponent(area)}${category ? `?category=${encodeURIComponent(category)}` : ''}`
    window.history.pushState({}, '', newUrl)
    
    // Filter businesses locally for instant feedback
    if (!category) {
      setBusinesses(initialBusinesses)
      setIsLoading(false)
    } else {
      const filtered = initialBusinesses.filter(business => 
        business.category.toLowerCase() === category.toLowerCase()
      )
      setBusinesses(filtered)
      setIsLoading(false)
    }
  }

  const clearCategoryFilter = () => {
    handleCategoryChange('')
  }

  const hasActiveFilter = selectedCategory

  // Calculate counts
  const totalBusinesses = initialBusinesses.length
  const categoryCounts = categories.map(category => {
    const count = initialBusinesses.filter(business => 
      business.category === category
    ).length
    return { category, count }
  }).filter(item => item.count > 0)

  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

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
              {totalBusinesses} service providers in {area}
              {selectedCategory && ` • ${businesses.length} in ${formatCategoryName(selectedCategory)}`}
            </p>
            
            {/* Category Counts */}
            {!selectedCategory && categoryCounts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {categoryCounts.slice(0, 8).map(({ category, count }) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    {formatCategoryName(category)}
                    <span className="ml-1 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-[20px]">
                      {count}
                    </span>
                  </button>
                ))}
                {categoryCounts.length > 8 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                    +{categoryCounts.length - 8} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
              >
                <option value="">All Categories in {area}</option>
                {categories.map(category => {
                  const count = initialBusinesses.filter(b => b.category === category).length
                  return (
                    <option key={category} value={category}>
                      {formatCategoryName(category)} ({count})
                    </option>
                  )
                })}
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
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
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
                <span>Filtering services...</span>
              </div>
            ) : (
              `${businesses.length} ${selectedCategory ? formatCategoryName(selectedCategory).toLowerCase() : 'service'} providers found in ${area}`
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
  )
}