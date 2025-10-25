import { BusinessService } from '@/services/businessService'

export async function generateStaticParams() {
  const areas = await BusinessService.getUniqueAreas()
  
  return areas.map(area => ({
    area: encodeURIComponent(area),
  }))
}