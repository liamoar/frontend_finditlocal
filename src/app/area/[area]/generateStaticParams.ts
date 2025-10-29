import { BusinessService } from '@/services/businessService'

export async function generateStaticParams() {
  const categories = await BusinessService.getUniqueCategories()
  
  // Only generate paths for categories
  return categories.map(category => ({
    category: encodeURIComponent(category),
  }))
}