import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import AreaClient from './AreaClient'

interface PageProps {
  params: Promise<{
    area: string
  }>
  searchParams: Promise<{
    category?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params
  const decodedArea = decodeURIComponent(area)
  
  return {
    title: `Local Services in ${decodedArea}, Dubai | FindInLocal`,
    description: `Find the best local service providers in ${decodedArea}, Dubai. Compare ratings, prices, and contact information for cleaning, moving, plumbing, electrical and more services.`,
  }
}

export default async function AreaPage({ params, searchParams }: PageProps) {
  const { area } = await params
  const { category } = await searchParams
  
  // Use decodeURIComponent to handle %20 spaces
  const decodedArea = decodeURIComponent(area)
  const decodedCategory = category ? decodeURIComponent(category) : ''
  
  const [businesses, categories] = await Promise.all([
    BusinessService.getBusinesses({ 
      area: decodedArea,
      category: decodedCategory
    }),
    BusinessService.getUniqueCategories()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AreaClient 
          initialBusinesses={businesses}
          categories={categories}
          area={decodedArea}
        />
      </div>
    </div>
  )
}