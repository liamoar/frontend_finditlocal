'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg" />
            <span className="font-bold text-xl text-gray-900">
              FindItLocal
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              All Companies
            </Link>
            <Link href="/category/cleaning" className="text-gray-700 hover:text-blue-600">
              Cleaning
            </Link>
            <Link href="/category/moving" className="text-gray-700 hover:text-blue-600">
              Moving
            </Link>
          </nav>

          <Link
            href="/search"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
        </div>
      </div>
    </header>
  )
}