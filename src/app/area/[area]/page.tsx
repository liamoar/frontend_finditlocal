import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import AreaClient from './AreaClient'

interface PageProps {
  params: Promise<{ area: string }>
  searchParams: Promise<{ 
    category?: string 
    page?: string 
    sort?: 'rating' | 'reviews' | 'name' | 'newest'
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
  const { category, page, sort } = await searchParams
  
  const decodedArea = decodeURIComponent(area)
  const decodedCategory = category ? decodeURIComponent(category) : ''
  const currentPage = parseInt(page || '1')
  const sortBy = sort || 'rating'

  const [result, categories] = await Promise.all([
    BusinessService.getBusinessesPaginated(
      { 
        area: decodedArea, 
        category: decodedCategory 
      },
      { 
        page: currentPage, 
        pageSize: 12, 
        sortBy 
      }
    ),
    BusinessService.getUniqueCategories()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AreaClient 
          initialData={result}
          categories={categories} 
          area={decodedArea}
          currentPage={currentPage}
          currentSort={sortBy}
          currentCategory={decodedCategory}
        />
      </div>
    </div>
  )
}