import Logo from './Logo'
import { Search, ChevronDown, MapPin } from 'lucide-react'
import Link from 'next/link'
import HeaderNavigation from './HeaderNavigation'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <HeaderNavigation />
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              All Services
            </Link>
          </nav>

          {/* Search CTA */}
          <Link
            href="/search"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            aria-label="Search all services"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </div>
    </header>
  )
}