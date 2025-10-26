import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import SearchClient from '@/components/SearchClient'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    category?: string
    area?: string
    page?: string
    sort?: string
  }>
}

export const metadata: Metadata = {
  title: 'Search Local Services in Dubai | FindItLocal',
  description: 'Search and compare local service providers across Dubai. Filter by category, area, and ratings to find the perfect service for your needs.',
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const sortBy = params.sort as 'rating' | 'reviews' | 'name' | 'newest' || 'rating'

  const result = await BusinessService.getBusinessesPaginated(
    {
      query: params.query,
      category: params.category,
      area: params.area
    },
    {
      page,
      pageSize: 20,
      sortBy
    }
  )

  const [categories, areas] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas()
  ])

  return (
    <SearchClient 
      initialData={result}
      categories={categories}
      areas={areas}
      initialFilters={{
        query: params.query || '',
        category: params.category || '',
        area: params.area || ''
      }}
      initialSort={sortBy}
      currentPage={page}
    />
  )
}