'use client'

import { useState, useEffect } from 'react'
import { BusinessService } from '@/services/businessService'
import { ChevronDown, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function HeaderNavigation() {
  const [categories, setCategories] = useState<string[]>([])
  const [areas, setAreas] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, ars] = await Promise.all([
          BusinessService.getUniqueCategories(),
          BusinessService.getUniqueAreas()
        ])
        setCategories(cats.slice(0, 8)) // Top 8 categories
        setAreas(ars.slice(0, 10)) // Top 10 areas
      } catch (error) {
        console.error('Failed to load navigation data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-8">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    )
  }

  return (
    <>
      {/* Services Dropdown */}
      <div className="relative group" role="navigation" aria-label="Service categories">
        <button 
          className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span>Services</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Services</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors capitalize"
                  title={`Find ${formatCategoryName(category)} services in Dubai`}
                >
                  {formatCategoryName(category)}
                </Link>
              ))}
            </div>
            <Link
              href="/search"
              className="block text-sm text-blue-600 font-medium mt-3 pt-3 border-t border-gray-100 hover:text-blue-700"
            >
              View all services →
            </Link>
          </div>
        </div>
      </div>

      {/* Areas Dropdown */}
      <div className="relative group" role="navigation" aria-label="Dubai areas">
        <button 
          className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <MapPin className="w-4 h-4" />
          <span>Areas</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Dubai Areas</h3>
            <div className="grid grid-cols-1 gap-2">
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`/area/${encodeURIComponent(area)}`}
                  className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  title={`Find services in ${area}, Dubai`}
                >
                  {area}
                </Link>
              ))}
            </div>
            <Link
              href="/search"
              className="block text-sm text-blue-600 font-medium mt-3 pt-3 border-t border-gray-100 hover:text-blue-700"
            >
              View all areas →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}