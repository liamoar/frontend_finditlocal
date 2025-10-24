import { BusinessService } from '@/services/businessService'

export async function generateStaticParams() {
  const categories = await BusinessService.getUniqueCategories()
  
  return categories.map(category => ({
    category: encodeURIComponent(category),
  }))
}