import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import CategoryClient from './categoryClient'

interface PageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    area?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  return {
    title: `${decodedCategory} in Dubai | Find Trusted ${decodedCategory} Providers | FindInLocal`,
    description: `Find the best ${decodedCategory.toLowerCase()} companies in Dubai. Compare ratings, prices, and contact information for trusted ${decodedCategory.toLowerCase()} services.`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const { area } = await searchParams
  
  // Use decodeURIComponent to handle %20 spaces
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = area ? decodeURIComponent(area) : ''
  
  const [businesses, areas] = await Promise.all([
    BusinessService.getBusinesses({ 
      category: decodedCategory,
      area: decodedArea
    }),
    BusinessService.getUniqueAreas()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryClient 
          initialBusinesses={businesses}
          areas={areas}
          category={decodedCategory}
        />
      </div>
    </div>
  )
}