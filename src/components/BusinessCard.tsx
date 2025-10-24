import { Business } from '@/types/business'
import { MapPin, Phone, Star, Globe, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          <Link href={`/business/${business.id}`} className="hover:text-blue-600">
            {business.name}
          </Link>
        </h3>
        {business.rating && (
          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {business.rating}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{business.area}, Dubai</span>
        </div>

        {business.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <a href={`tel:${business.phone}`} className="hover:text-blue-600">
              {business.phone}
            </a>
          </div>
        )}

        {business.website && (
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 truncate"
            >
              Visit Website
            </a>
          </div>
        )}

        {business.whatsapp && (
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <a 
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600"
            >
              WhatsApp
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
          {business.category}
        </span>
        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
          {business.area}
        </span>
      </div>
    </div>
  )
}