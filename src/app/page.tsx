import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PopularCategories from '@/components/PopularCategories'
import PopularAreas from '@/components/PopularAreas'
import { BusinessService } from '@/services/businessService'

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching

export default async function Home() {
  const [categories, areas] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <PopularCategories categories={categories} />
      <PopularAreas areas={areas} />
    </div>
  )
}