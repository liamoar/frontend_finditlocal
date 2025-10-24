import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import BusinessGrid from '@/components/BusinessGrid'
import Header from '@/components/Header'

interface PageProps {
  params: Promise<{
    category: string
    area: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params promise
  const { category, area } = await params
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = decodeURIComponent(area)
  
  return {
    title: `${decodedCategory} Companies in ${decodedArea}, Dubai | Top Rated Services`,
    description: `Find the best ${decodedCategory.toLowerCase()} companies in ${decodedArea}, Dubai. Compare ratings, prices, and contact information for local ${decodedCategory.toLowerCase()} services.`,
  }
}

export default async function CategoryAreaPage({ params }: PageProps) {
  // Await the params promise
  const { category, area } = await params
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = decodeURIComponent(area)
  const businesses = await BusinessService.getBusinessesByCategoryAndArea(decodedCategory, decodedArea)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {decodedCategory} Companies in {decodedArea}, Dubai
          </h1>
          <p className="text-gray-600">
            Find the best {decodedCategory.toLowerCase()} companies in {decodedArea}
          </p>
        </div>
        
        <BusinessGrid businesses={businesses} />
      </div>
    </div>
  )
}