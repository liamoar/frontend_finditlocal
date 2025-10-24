import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import StructuredData from '@/components/StructuredData'
import { MapPin, Phone, Star, Globe, MessageCircle, Clock } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params promise
  const { id } = await params
  const business = await BusinessService.getBusinessById(parseInt(id))
  
  if (!business) {
    return {
      title: 'Company Not Found',
    }
  }

  return {
    title: `${business.name} - ${business.category} in ${business.area}, Dubai`,
    description: `Contact ${business.name} for ${business.category} services in ${business.area}, Dubai. ${business.phone ? `Call ${business.phone}` : ''}`,
  }
}

export default async function BusinessPage({ params }: PageProps) {
  // Await the params promise
  const { id } = await params
  const business = await BusinessService.getBusinessById(parseInt(id))

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StructuredData business={business} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                    {business.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{business.area}, Dubai</span>
                  </div>
                </div>
              </div>
              
              {business.rating && (
                <div className="mt-4 md:mt-0 bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold">{business.rating}</span>
                  {business.reviews && (
                    <span className="text-blue-500">({business.reviews} reviews)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{business.address}</span>
                </div>
                
                {business.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${business.phone}`} className="text-blue-600 hover:text-blue-700">
                      {business.phone}
                    </a>
                  </div>
                )}
                
                {business.international_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${business.international_phone}`} className="text-blue-600 hover:text-blue-700">
                      {business.international_phone} (International)
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                {business.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`https://wa.me/${business.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {business.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {business.area}
                  </span>
                </div>
                
                {business.opening_hours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-medium">Opening Hours:</span>
                      <pre className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
                        {JSON.stringify(business.opening_hours, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}