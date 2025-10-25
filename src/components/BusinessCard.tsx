'use client'

import { Business } from '@/types/business'
import { MapPin, Phone, Star, Globe, MessageCircle, Clock, User, Navigation } from 'lucide-react'

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const formatOpeningHours = (openingHours: any) => {
    if (!openingHours) return null
    
    try {
      // If it's the Google Places API format with weekday_text
      if (openingHours.weekday_text && Array.isArray(openingHours.weekday_text)) {
        const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
        
        // Adjust for Google's format: weekday_text[0] is Monday, [6] is Sunday
        let todayIndex = today - 1
        if (today === 0) todayIndex = 6 // Sunday is last in array
        
        if (openingHours.weekday_text[todayIndex]) {
          const todayHours = openingHours.weekday_text[todayIndex]
          // Remove day name and show just hours
          const hoursOnly = todayHours.replace(/^[^:]+:\s*/, '')
          return `Today: ${hoursOnly}`
        }
        
        // Fallback: show first day's hours
        return openingHours.weekday_text[0]?.replace(/^[^:]+:\s*/, '')
      }
      
      // Handle string format as fallback
      if (typeof openingHours === 'string') {
        return openingHours.length > 60 ? `${openingHours.substring(0, 60)}...` : openingHours
      }
      
    } catch (error) {
      console.error('Error formatting opening hours:', error)
    }
    
    return 'Opening hours available'
  }

  const getRatingSource = () => {
    if (business.reviews && business.reviews > 0) {
      return 'Google'
    }
    return 'Local'
  }

  const shouldShowRating = business.rating !== null && business.rating !== undefined
  const openingHours = formatOpeningHours(business.opening_hours)

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
            <div className="flex-1">
              <span className="text-green-600 font-medium text-xs">
                {openingHours}
              </span>
              {/* Show "Open Now" badge if available */}
              {business.opening_hours?.open_now && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                  Open Now
                </span>
              )}
            </div>
          </div>
        )}
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

      {/* Categories and Area Tags */}
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