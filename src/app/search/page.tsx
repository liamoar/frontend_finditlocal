import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import SearchClient from '@/components/SearchClient'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    category?: string
    area?: string
  }>
}

export const metadata: Metadata = {
  title: 'Search Local Services in Dubai | FindInLocal',
  description: 'Search and compare local service providers across Dubai. Filter by category, area, and ratings to find the perfect service for your needs.',
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await the searchParams promise
  const params = await searchParams
  const initialBusinesses = await BusinessService.getBusinesses(params)
  const categories = await BusinessService.getUniqueCategories()
  const areas = await BusinessService.getUniqueAreas()

  return (
    <SearchClient 
      initialBusinesses={initialBusinesses}
      categories={categories}
      areas={areas}
      initialFilters={params}
    />
  )
}