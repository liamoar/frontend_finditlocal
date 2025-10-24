import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface PopularAreasProps {
  areas: string[]
}

export default function PopularAreas({ areas }: PopularAreasProps) {
  const popularAreas = areas.slice(0, 12) // Show top 12 areas

  // Group areas into chunks for better layout
  const chunkedAreas = []
  for (let i = 0; i < popularAreas.length; i += 4) {
    chunkedAreas.push(popularAreas.slice(i, i + 4))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Areas in Dubai
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find service providers in your preferred location across Dubai
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {chunkedAreas.map((areaChunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-4">
              {areaChunk.map((area) => (
                <Link
                  key={area}
                  href={`/area/${encodeURIComponent(area)}`}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-blue-200 group"
                >
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                    {area}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {areas.length > 12 && (
          <div className="text-center mt-8">
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Areas
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}