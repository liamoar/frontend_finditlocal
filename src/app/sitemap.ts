import { BusinessService } from '@/services/businessService'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://findinlocal.com'
  
  const [categories, areas] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas()
  ])

  // Static Pages - High Priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ]

  // Category Pages - Medium Priority
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Area Pages - Medium Priority
  const areaPages = areas.map(area => ({
    url: `${baseUrl}/area/${encodeURIComponent(area)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category + Area Combination Pages - Use query parameters
  const categoryAreaPages = categories.flatMap(category =>
    areas.slice(0, 3).map(area => ({
      url: `${baseUrl}/category/${encodeURIComponent(category)}?area=${encodeURIComponent(area)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [
    ...staticPages,
    ...categoryPages,
    ...areaPages,
    ...categoryAreaPages,
  ]
}