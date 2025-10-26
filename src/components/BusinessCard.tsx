'use client'

import { Business } from '@/types/business'
import { MapPin, Phone, Star, Globe, MessageCircle, Clock, User, Navigation, Tag } from 'lucide-react'

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const formatOpeningHours = (openingHours: any) => {
    if (!openingHours) return null
    
    try {
      if (typeof openingHours === 'string') {
        return openingHours.length > 60 ? `${openingHours.substring(0, 60)}...` : openingHours
      }
      
      if (typeof openingHours === 'object') {
        if (openingHours.weekday_text) {
          return openingHours.weekday_text[0] // Show first day
        }
        
        const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
        if (openingHours[today]) {
          return `Today: ${openingHours[today]}`
        }
        
        return 'Opening hours available'
      }
    } catch (error) {
      return 'Opening hours available'
    }
    
    return null
  }

  const getRatingSource = () => {
    if (business.reviews && business.reviews > 0) {
      return 'Google'
    }
    return 'Local'
  }

  const shouldShowRating = business.rating !== null && business.rating !== undefined
  const openingHours = formatOpeningHours(business.opening_hours)
  
  // Safe topics handling
  const topics = business.topics || []
  const hasTopics = topics.length > 0

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${business.name} ${business.area} Dubai`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
      {/* Header with Name and Rating */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
          {business.name}
        </h3>
        
        {/* Rating Badge */}
        {shouldShowRating && business.rating && (
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {business.rating.toFixed(1)}
              </span>
            </div>
            {business.reviews && (
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {business.reviews > 1000 ? `${(business.reviews/1000).toFixed(1)}k` : business.reviews}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="space-y-3 text-sm text-gray-600 flex-1">
        {/* Location with Map Action */}
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="line-clamp-2">{business.area}, Dubai</span>
            <button 
              onClick={openGoogleMaps}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center space-x-1"
            >
              <Navigation className="w-3 h-3" />
              <span>View on Map</span>
            </button>
          </div>
        </div>

        {/* Opening Hours */}
        {openingHours && (
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-green-600 font-medium text-xs">
              {openingHours}
            </span>
          </div>
        )}

        {/* Topics - Review Highlights */}
       {/* {hasTopics && (
          <div className="flex items-start space-x-2 pt-2">
            <Tag className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 font-medium mb-1 block">Review Highlights:</span>
              <div className="flex flex-wrap gap-1">
                {topics.slice(0, 5).map((topic, index) => (
                  <span
                    key={index}
                    className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-200"
                    title={`Customers mention: ${topic}`}
                  >
                    #{topic.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {business.phone && (
          <a 
            href={`tel:${business.phone}`}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 min-w-[120px] justify-center"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        )}

        {business.whatsapp && (
          <a 
            href={`https://wa.me/${business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 min-w-[120px] justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        )}

        {business.website && (
          <a 
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 min-w-[120px] justify-center"
          >
            <Globe className="w-4 h-4" />
            <span>Website</span>
          </a>
        )}
      </div>

      {/* Categories, Area, and Rating Tags */}
      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
          {business.category.replace('service', '').replace('company', '').trim()}
        </span>
        <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          {business.area}
        </span>
        
        {/* Rating Source Tag */}
        {shouldShowRating && business.rating && (
          <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
            {getRatingSource()} Rated
          </span>
        )}
      </div>
    </div>
  )
}