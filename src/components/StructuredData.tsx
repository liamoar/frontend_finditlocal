import { Business } from '@/types/business'

interface StructuredDataProps {
  business: Business
}

export default function StructuredData({ business }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.area,
      addressRegion: 'Dubai',
      addressCountry: 'AE'
    },
    telephone: business.phone,
    url: business.website,
    rating: business.rating ? {
      '@type': 'AggregateRating',
      ratingValue: business.rating.toString(),
      reviewCount: business.reviews?.toString()
    } : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}