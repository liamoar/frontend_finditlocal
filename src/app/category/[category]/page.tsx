import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import CategoryClient from './categoryClient'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ 
    area?: string 
    page?: string 
    sort?: 'rating' | 'reviews' | 'name' | 'newest'
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
  const { area, page, sort } = await searchParams
  
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = area ? decodeURIComponent(area) : ''
  const currentPage = parseInt(page || '1')
  const sortBy = sort || 'rating'

  const [result, areas, allAreasResult] = await Promise.all([
    BusinessService.getBusinessesPaginated(
      { 
        category: decodedCategory, 
        area: decodedArea 
      },
      { 
        page: currentPage, 
        pageSize: 12, 
        sortBy 
      }
    ),
    BusinessService.getUniqueAreas(),
    // Get total counts for each area to show in the filter badges
    BusinessService.getBusinessesPaginated(
      { 
        category: decodedCategory
      },
      { 
        page: 1, 
        pageSize: 1000, // Large number to get all businesses
        sortBy: 'name' 
      }
    )
  ])

  // Calculate area counts for the filter badges
  const areaCounts = allAreasResult.businesses.reduce((acc, business) => {
    acc[business.area] = (acc[business.area] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryClient 
          initialData={result}
          areas={areas} 
          category={decodedCategory}
          currentPage={currentPage}
          currentSort={sortBy}
          currentArea={decodedArea}
          areaCounts={areaCounts}
        />
      </div>
    </div>
  )
}