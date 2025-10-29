import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import CategoryClient from './categoryClient'
import PopularAreas from '@/components/PopularAreas'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ 
    area?: string 
    page?: string 
    sort?: 'rating' | 'reviews' | 'name' | 'newest'
  }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category } = await params
  const { area } = await searchParams
  
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = area ? decodeURIComponent(area) : ''
  
  // Dynamic titles and descriptions based on filters
  const baseTitle = `${decodedCategory} Services in Dubai | Top ${decodedCategory} Companies | FindInLocal`
  const areaTitle = `${decodedCategory} Services in ${decodedArea}, Dubai | Local ${decodedCategory} Providers`
  
  const baseDescription = `Find the best ${decodedCategory.toLowerCase()} companies in Dubai. Compare ratings, prices, and contact information for trusted ${decodedCategory.toLowerCase()} services near you.`
  const areaDescription = `Top-rated ${decodedCategory.toLowerCase()} services in ${decodedArea}, Dubai. Compare prices, read reviews, and contact local ${decodedCategory.toLowerCase()} providers directly.`
  
  const title = decodedArea ? areaTitle : baseTitle
  const description = decodedArea ? areaDescription : baseDescription
  
  // Canonical URL
  const baseUrl = 'https://findinlocal.com'
  const canonicalUrl = decodedArea 
    ? `${baseUrl}/category/${encodeURIComponent(decodedCategory)}?area=${encodeURIComponent(decodedArea)}`
    : `${baseUrl}/category/${encodeURIComponent(decodedCategory)}`

  return {
    title,
    description,
    keywords: `${decodedCategory.toLowerCase()} dubai, ${decodedCategory.toLowerCase()} services, ${decodedCategory.toLowerCase()} companies, ${decodedArea ? `${decodedCategory.toLowerCase()} ${decodedArea.toLowerCase()}` : ''}, home services dubai, local services`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AE',
      siteName: 'FindInLocal',
      url: canonicalUrl,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Find ${decodedCategory} Services in Dubai - FindInLocal`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Add your actual code
    },
  }
}

// JSON-LD Structured Data for Category Pages
function CategoryStructuredData({ category, area, businessesCount }: { category: string; area?: string; businessesCount: number }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${category} Services in ${area ? area + ', ' : ''}Dubai`,
    'description': `Directory of ${businessesCount} ${category.toLowerCase()} service providers in ${area ? area + ', ' : ''}Dubai`,
    'numberOfItems': businessesCount,
    'itemListOrder': 'https://schema.org/ItemListOrderAscending',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://findinlocal.com/category/${encodeURIComponent(category)}${area ? `?area=${encodeURIComponent(area)}` : ''}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Breadcrumb Structured Data
function BreadcrumbStructuredData({ category, area }: { category: string; area?: string }) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://findinlocal.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Services',
        'item': 'https://findinlocal.com/search'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': category,
        'item': `https://findinlocal.com/category/${encodeURIComponent(category)}`
      },
      ...(area ? [{
        '@type': 'ListItem',
        'position': 4,
        'name': area,
        'item': `https://findinlocal.com/category/${encodeURIComponent(category)}?area=${encodeURIComponent(area)}`
      }] : [])
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  )
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const { area, page, sort } = await searchParams
  
  const decodedCategory = decodeURIComponent(category)
  const decodedArea = area ? decodeURIComponent(area) : ''
  const currentPage = parseInt(page || '1')
  const sortBy = sort || 'rating'

  const [result, areas, allAreasResult, popularAreas] = await Promise.all([
    BusinessService.getBusinessesPaginated(
      { 
        category: decodedCategory, 
        area: decodedArea 
      },
      { 
        page: currentPage, 
        pageSize: 12, 
        sortBy 
      }
    ),
    BusinessService.getUniqueAreas(),
    BusinessService.getBusinessesPaginated(
      { 
        category: decodedCategory
      },
      { 
        page: 1, 
        pageSize: 1000,
        sortBy: 'name' 
      }
    ),
    BusinessService.getUniqueAreas() // For popular areas section
  ])

  // Calculate area counts for the filter badges
  const areaCounts = allAreasResult.businesses.reduce((acc, business) => {
    acc[business.area] = (acc[business.area] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .replace('service', '')
      .replace('company', '')
      .trim()
  }

  const displayCategoryName = formatCategoryName(decodedCategory)

  return (
    <>
      {/* Structured Data */}
      <CategoryStructuredData 
        category={decodedCategory} 
        area={decodedArea} 
        businessesCount={result.totalCount} 
      />
      <BreadcrumbStructuredData category={decodedCategory} area={decodedArea} />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Category Intro Section */}
          {!decodedArea && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
                Find Trusted {displayCategoryName} Services in Dubai
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Discover the best {displayCategoryName.toLowerCase()} companies in Dubai with verified contact details, 
                customer ratings, and service information. Compare {result.totalCount.toLocaleString()} trusted providers 
                to find the perfect match for your needs.
              </p>
            </section>
          )}

          {/* Business Listings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CategoryClient 
              initialData={result}
              areas={areas} 
              category={decodedCategory}
              currentPage={currentPage}
              currentSort={sortBy}
              currentArea={decodedArea}
              areaCounts={areaCounts}
            />
          </div>

          {/* Popular Areas for this Category - Only show when no area filter */}
          {!decodedArea && (
            <section className="py-16 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                    {displayCategoryName} Services Across Dubai Areas
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Find trusted {displayCategoryName.toLowerCase()} providers in your preferred location
                  </p>
                </div>
                <PopularAreas areas={popularAreas.slice(0, 12)} />
              </div>
            </section>
          )}

          {/* How It Works Section */}
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How to Find the Best {displayCategoryName} Services
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    1. Browse & Compare
                  </h3>
                  <p>
                    View {displayCategoryName.toLowerCase()} companies with ratings, reviews, and service details all in one place.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    2. Check Availability
                  </h3>
                  <p>
                    Filter by your area in Dubai to find providers that serve your location.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    3. Contact Directly
                  </h3>
                  <p>
                    Call, WhatsApp, or visit websites directly — no middlemen or hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Category-Specific FAQ */}
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                Frequently Asked Questions About {displayCategoryName} Services
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2 capitalize">
                    How do I choose the right {displayCategoryName.toLowerCase()} company in Dubai?
                  </h3>
                  <p className="text-gray-700">
                    Compare ratings, read customer reviews, check service areas, and review pricing information. 
                    Look for companies with verified contact details and good response times.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    What areas in Dubai do these services cover?
                  </h3>
                  <p className="text-gray-700">
                    {displayCategoryName} services are available across all major Dubai areas including Downtown, 
                    Dubai Marina, Jumeirah, Business Bay, and more. Use the area filter to find providers in your location.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2 capitalize">
                    Are the {displayCategoryName.toLowerCase()} companies on FindInLocal verified?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we list publicly available and verified companies with accurate contact information. 
                    We continuously update our database to ensure you have access to reliable service providers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    How current is the pricing and service information?
                  </h3>
                  <p className="text-gray-700">
                    We regularly update our listings, but we recommend contacting companies directly for the most 
                    current pricing, availability, and service details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
              <p className="capitalize">
                Disclaimer: FindInLocal does not provide {displayCategoryName.toLowerCase()} services directly. 
                We only list publicly available and verified companies to make it easier for you to find and contact them.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}