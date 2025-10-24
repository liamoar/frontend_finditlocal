import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PopularCategories from '@/components/PopularCategories'
import PopularAreas from '@/components/PopularAreas'
import { BusinessService } from '@/services/businessService'

export default async function Home() {
  const [categories, areas] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero categories={categories} areas={areas} />
      <PopularCategories categories={categories} />
      <PopularAreas areas={areas} />
    </div>
  )
}