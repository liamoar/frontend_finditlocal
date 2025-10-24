import { BusinessService } from '@/services/businessService'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000/'
  
  const [categories, areas, businesses] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas(),
    BusinessService.getBusinesses()
  ])

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ]

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const areaPages = areas.map(area => ({
    url: `${baseUrl}/area/${encodeURIComponent(area)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const businessPages = businesses.map(business => ({
    url: `${baseUrl}/business/${business.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categoryAreaPages = categories.flatMap(category =>
    areas.map(area => ({
      url: `${baseUrl}/category/${encodeURIComponent(category)}/${encodeURIComponent(area)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [
    ...staticPages,
    ...categoryPages,
    ...areaPages,
    ...businessPages,
    ...categoryAreaPages,
  ]
}