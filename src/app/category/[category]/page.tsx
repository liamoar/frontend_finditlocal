import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import BusinessGrid from '@/components/BusinessGrid'
import Header from '@/components/Header'

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params promise
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  return {
    title: `${decodedCategory} Companies in Dubai | Best ${decodedCategory} Services`,
    description: `Find the best ${decodedCategory.toLowerCase()} companies in Dubai. Compare ratings, prices, and contact information for trusted ${decodedCategory.toLowerCase()} services.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  // Await the params promise
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const businesses = await BusinessService.getBusinesses({ category: decodedCategory })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {decodedCategory} Companies in Dubai
          </h1>
          <p className="text-gray-600">
            Find the best {decodedCategory.toLowerCase()} companies across all Dubai areas
          </p>
        </div>
        
        <BusinessGrid businesses={businesses} />
      </div>
    </div>
  )
}