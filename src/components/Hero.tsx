'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BusinessService } from '@/services/businessService'
import { Search } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

export default function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [popularCategories, setPopularCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await BusinessService.getUniqueCategories()
      setPopularCategories(categories.slice(0, 6)) // Top 6 categories for tags
    }
    loadCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    router.push(`/category/${encodeURIComponent(category)}`)
  }

  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20" aria-labelledby="hero-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6">
          Find Trusted Local Services in Dubai
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Discover the best cleaning, moving, plumbing, and home services across Dubai
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 shadow-lg mb-8" role="search">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search for services, companies, or keywords..."
                className="w-full pl-10 pr-4 py-4 text-gray-900 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
                aria-label="Search for services in Dubai"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              aria-label="Search services"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Search size={24} className="sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Popular Categories */}
        <div className="text-center">
          <p className="text-blue-200 mb-4 text-lg">Popular Services:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium backdrop-blur-sm border border-white/20 disabled:opacity-50 capitalize"
                title={`Browse ${formatCategoryName(category)} services`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}