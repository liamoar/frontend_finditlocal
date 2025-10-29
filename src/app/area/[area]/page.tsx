import { Metadata } from 'next'
import { BusinessService } from '@/services/businessService'
import Header from '@/components/Header'
import AreaClient from './AreaClient'
import PopularCategories from '@/components/PopularCategories'

interface PageProps {
  params: Promise<{ area: string }>
  searchParams: Promise<{ 
    category?: string 
    page?: string 
    sort?: 'rating' | 'reviews' | 'name' | 'newest'
  }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { area } = await params
  const { category } = await searchParams
  
  const decodedArea = decodeURIComponent(area)
  const decodedCategory = category ? decodeURIComponent(category) : ''
  
  // Dynamic titles and descriptions based on filters
  const baseTitle = `Local Services in ${decodedArea}, Dubai | Service Providers | FindInLocal`
  const categoryTitle = `${decodedCategory} Services in ${decodedArea}, Dubai | Top Companies`
  
  const baseDescription = `Find the best local service providers in ${decodedArea}, Dubai. Compare ratings, prices, and contact information for cleaning, moving, plumbing, electrical and more services.`
  const categoryDescription = `Top-rated ${decodedCategory.toLowerCase()} companies in ${decodedArea}, Dubai. Compare prices, read reviews, and contact local ${decodedCategory.toLowerCase()} providers directly.`
  
  const title = decodedCategory ? categoryTitle : baseTitle
  const description = decodedCategory ? categoryDescription : baseDescription
  
  // Canonical URL
  const baseUrl = 'https://findinlocal.com'
  const canonicalUrl = decodedCategory 
    ? `${baseUrl}/area/${encodeURIComponent(decodedArea)}?category=${encodeURIComponent(decodedCategory)}`
    : `${baseUrl}/area/${encodeURIComponent(decodedArea)}`

  return {
    title,
    description,
    keywords: `services in ${decodedArea.toLowerCase()}, ${decodedArea.toLowerCase()} dubai, local services ${decodedArea.toLowerCase()}, ${decodedCategory ? `${decodedCategory.toLowerCase()} ${decodedArea.toLowerCase()}` : 'home services'}, dubai areas`,
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
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Find Local Services in ${decodedArea}, Dubai - FindInLocal`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
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
      google: 'your-google-verification-code',
    },
  }
}

// JSON-LD Structured Data for Area Pages
function AreaStructuredData({ area, category, businessesCount }: { area: string; category?: string; businessesCount: number }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Local Services in ${area}, Dubai${category ? ` - ${category}` : ''}`,
    'description': `Directory of ${businessesCount} local service providers in ${area}, Dubai${category ? ` specializing in ${category.toLowerCase()}` : ''}`,
    'numberOfItems': businessesCount,
    'itemListOrder': 'https://schema.org/ItemListOrderAscending',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://findinlocal.com/area/${encodeURIComponent(area)}${category ? `?category=${encodeURIComponent(category)}` : ''}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Breadcrumb Structured Data for Area Pages
function AreaBreadcrumbStructuredData({ area, category }: { area: string; category?: string }) {
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
        'name': 'Areas',
        'item': 'https://findinlocal.com/search'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': area,
        'item': `https://findinlocal.com/area/${encodeURIComponent(area)}`
      },
      ...(category ? [{
        '@type': 'ListItem',
        'position': 4,
        'name': category,
        'item': `https://findinlocal.com/area/${encodeURIComponent(area)}?category=${encodeURIComponent(category)}`
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

export default async function AreaPage({ params, searchParams }: PageProps) {
  const { area } = await params
  const { category, page, sort } = await searchParams
  
  const decodedArea = decodeURIComponent(area)
  const decodedCategory = category ? decodeURIComponent(category) : ''
  const currentPage = parseInt(page || '1')
  const sortBy = sort || 'rating'

  const [result, categories, popularCategories] = await Promise.all([
    BusinessService.getBusinessesPaginated(
      { 
        area: decodedArea, 
        category: decodedCategory 
      },
      { 
        page: currentPage, 
        pageSize: 12, 
        sortBy 
      }
    ),
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueCategories() // For popular categories section
  ])

  return (
    <>
      {/* Structured Data */}
      <AreaStructuredData 
        area={decodedArea} 
        category={decodedCategory} 
        businessesCount={result.totalCount} 
      />
      <AreaBreadcrumbStructuredData area={decodedArea} category={decodedCategory} />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Area Intro Section */}
          {!decodedCategory && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Local Services in {decodedArea}, Dubai
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Discover {result.totalCount.toLocaleString()} trusted service providers in {decodedArea}. 
                From cleaning and moving to plumbing and AC repair — find all the local services you need in one place.
              </p>
            </section>
          )}

          {/* Business Listings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AreaClient 
              initialData={result}
              categories={categories} 
              area={decodedArea}
              currentPage={currentPage}
              currentSort={sortBy}
              currentCategory={decodedCategory}
            />
          </div>

          {/* Popular Categories in this Area - Only show when no category filter */}
          {!decodedCategory && (
            <section className="py-16 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Popular Services in {decodedArea}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Browse the most requested service categories in {decodedArea}, Dubai
                  </p>
                </div>
                <PopularCategories categories={popularCategories.slice(0, 12)} />
              </div>
            </section>
          )}

          {/* How It Works Section */}
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Finding Services in {decodedArea}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    1. Search by Service
                  </h3>
                  <p>
                    Browse through cleaning, moving, plumbing, and other service categories available in {decodedArea}.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    2. Compare Providers
                  </h3>
                  <p>
                    View ratings, reviews, and contact information for multiple companies serving {decodedArea}.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">
                    3. Connect Directly
                  </h3>
                  <p>
                    Contact your chosen provider directly via phone, WhatsApp, or website — no commissions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Area-Specific FAQ */}
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                Frequently Asked Questions About Services in {decodedArea}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    What types of services are available in {decodedArea}?
                  </h3>
                  <p className="text-gray-700">
                    {decodedArea} has a wide range of service providers including cleaning companies, 
                    movers, plumbers, electricians, AC repair services, pest control, and many more home services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    How do I know if a company serves my specific location in {decodedArea}?
                  </h3>
                  <p className="text-gray-700">
                    All listed companies provide services in {decodedArea}. For specific building or community 
                    coverage, we recommend contacting the company directly to confirm.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    Are the contact details and ratings up to date?
                  </h3>
                  <p className="text-gray-700">
                    We regularly verify and update our listings to ensure you have access to current contact 
                    information and accurate customer ratings for companies in {decodedArea}.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    Can I find emergency services in {decodedArea}?
                  </h3>
                  <p className="text-gray-700">
                    Many service providers in {decodedArea} offer emergency and same-day services. 
                    Look for companies with 24/7 availability or contact them directly for urgent needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
              <p>
                Disclaimer: FindInLocal does not provide services directly. We only list publicly available 
                and verified companies in {decodedArea} to make it easier for you to find and contact them.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}