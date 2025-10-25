'use client'

import { useState, useEffect } from 'react'
import { Business } from '@/types/business'
import BusinessGrid from '@/components/BusinessGrid'
import { Filter, X } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import BusinessGridLoading from '@/components/BusinessGridLoading'

interface CategoryClientProps {
  initialBusinesses: Business[]
  areas: string[]
  category: string
}

export default function CategoryClient({ 
  initialBusinesses, 
  areas, 
  category 
}: CategoryClientProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses)
  const [selectedArea, setSelectedArea] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setBusinesses(initialBusinesses)
  }, [initialBusinesses])

  const handleAreaChange = async (area: string) => {
    setSelectedArea(area)
    setIsLoading(true)
    
    // Update URL without navigation for better UX
    const newUrl = `/category/${encodeURIComponent(category)}${area ? `?area=${encodeURIComponent(area)}` : ''}`
    window.history.pushState({}, '', newUrl)
    
    // Filter businesses locally for instant feedback
    if (!area) {
      setBusinesses(initialBusinesses)
      setIsLoading(false)
    } else {
      const filtered = initialBusinesses.filter(business => 
        business.area.toLowerCase() === area.toLowerCase()
      )
      setBusinesses(filtered)
      setIsLoading(false)
    }
  }

  const clearAreaFilter = () => {
    handleAreaChange('')
  }

  const hasActiveFilter = selectedArea

  // Calculate counts for areas
  const totalBusinesses = initialBusinesses.length
  const areaCounts = areas.map(area => {
    const count = initialBusinesses.filter(business => 
      business.area === area
    ).length
    return { area, count }
  }).filter(item => item.count > 0)

  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

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
              {totalBusinesses} service providers in Dubai
              {selectedArea && ` • ${businesses.length} in ${selectedArea}`}
            </p>
            
            {/* Area Counts */}
            {!selectedArea && areaCounts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {areaCounts.slice(0, 8).map(({ area, count }) => (
                  <button
                    key={area}
                    onClick={() => handleAreaChange(area)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  >
                    {area}
                    <span className="ml-1 bg-green-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-[20px]">
                      {count}
                    </span>
                  </button>
                ))}
                {areaCounts.length > 8 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                    +{areaCounts.length - 8} more areas
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Area Filter */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
              >
                <option value="">All Areas in Dubai</option>
                {areas.map(area => {
                  const count = initialBusinesses.filter(b => b.area === area).length
                  return (
                    <option key={area} value={area}>
                      {area} ({count})
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Area: {selectedArea}
                <button
                  onClick={clearAreaFilter}
                  className="ml-2 hover:text-green-600"
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
                <span>Filtering companies...</span>
              </div>
            ) : (
              `${businesses.length} ${formatCategoryName(category).toLowerCase()} service providers found${selectedArea ? ` in ${selectedArea}` : ' across Dubai'}`
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