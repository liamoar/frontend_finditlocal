import { BusinessService } from '@/services/businessService'

export async function generateStaticParams() {
  const categories = await BusinessService.getUniqueCategories()
  const areas = await BusinessService.getUniqueAreas()
  
  // Generate all combinations of category and area
  const paths = categories.flatMap(category =>
    areas.map(area => ({
      category: encodeURIComponent(category),
      area: encodeURIComponent(area),
    }))
  )
  
  return paths
}