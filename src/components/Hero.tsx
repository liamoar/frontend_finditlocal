'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface HeroProps {
  categories: string[]
  areas: string[]
}

export default function Hero({ categories, areas }: HeroProps) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    query: ''
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (filters.query) params.set('query', filters.query)
    if (filters.category) params.set('category', filters.category)
    if (filters.area) params.set('area', filters.area)
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Trusted Cleaning & Moving Companies in Dubai
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          Compare ratings, prices, and services from the best cleaning and moving companies across all Dubai areas
        </p>

        <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 shadow-lg">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Search companies..."
              className="flex-1 px-4 py-3 text-gray-900 rounded-lg border-none focus:outline-none"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            />
            
            <select
              className="px-4 py-3 text-gray-900 rounded-lg border-none focus:outline-none"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              className="px-4 py-3 text-gray-900 rounded-lg border-none focus:outline-none"
              value={filters.area}
              onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
            >
              <option value="">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Search size={20} />
              <span className="ml-2">Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}