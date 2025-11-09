import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PopularCategories from '@/components/PopularCategories'
import PopularAreas from '@/components/PopularAreas'
import { BusinessService } from '@/services/businessService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const [categories, areas] = await Promise.all([
    BusinessService.getUniqueCategories(),
    BusinessService.getUniqueAreas(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <Hero />

        {/* Intro Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Trusted Cleaning, Moving, Plumbing & Home Services in Dubai
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            FindInLocal is Dubai's trusted directory for comparing cleaning
            companies, movers, plumbers, electricians, AC repair, and pest
            control services. We are not a service provider — instead, we help
            you discover verified businesses so you can make the right choice
            faster and easier.
          </p>
        </section>

        <PopularCategories categories={categories} />
        <PopularAreas areas={areas} />

        {/* How It Works Section */}
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How FindInLocal Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              We collect and organize verified data from reliable sources so you
              can explore the best local service providers in Dubai. From
              cleaning to moving and AC repair — find it all here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-blue-700">
                  1. Search
                </h3>
                <p>Search by category, area, or keyword to find what you need.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-blue-700">
                  2. Compare
                </h3>
                <p>
                  View details, ratings, and reviews for multiple service
                  providers in one place.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-blue-700">
                  3. Connect
                </h3>
                <p>
                  Call, WhatsApp, or visit the website of your chosen company
                  directly — no commissions, no middlemen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  How can I find trusted cleaning companies in Dubai?
                </h3>
                <p className="text-gray-700">
                  You can browse verified cleaning companies on FindInLocal by
                  visiting our Cleaning Services category. Each listing shows
                  real reviews, ratings, and contact options so you can choose
                  confidently.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Is FindInLocal a service provider?
                </h3>
                <p className="text-gray-700">
                  No — FindInLocal does not provide cleaning, moving, plumbing,
                  or any other services directly. We simply list verified local
                  companies for your convenience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Which services are listed on FindInLocal?
                </h3>
                <p className="text-gray-700">
                  You'll find popular categories like cleaning, moving, plumbing,
                  electrician, AC repair, pest control, and more. Each area of
                  Dubai has its own list of trusted providers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  How do I contact a company?
                </h3>
                <p className="text-gray-700">
                  Every listing includes "Call Now", "WhatsApp", and "Visit
                  Website" buttons so you can reach companies directly — no
                  middleman or hidden fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer & Footer Section */}
        <section className="bg-gray-100 py-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* Support Email */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Need Help? Contact Us
              </h3>
              <div className="text-gray-700">
                <a 
                  href="mailto:support@findinlocal.com" 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  support@findinlocal.com
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-sm text-gray-600 border-t border-gray-300 pt-6">
              <p>
                Disclaimer: FindInLocal does not provide cleaning, moving,
                plumbing, or other services directly. We only list publicly
                available and verified companies to make it easier for you to find
                and contact them.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}