import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FindInLocal - Discover Trusted Local Services in Dubai | Home Services Directory',
  description: 'Find the best local service providers in Dubai. Compare ratings, prices, and services for cleaning, moving, plumbing, electrical, AC repair, pest control and more across all Dubai areas.',
  keywords: 'local services dubai, home services, cleaning, moving, plumbing, electrician, AC repair, pest control, carpentry, painting, home renovation, laundry, maid service, appliance repair',
  openGraph: {
    title: 'FindInLocal - Discover Trusted Local Services in Dubai',
    description: 'Find trusted local service providers across Dubai for all your home and business needs.',
    type: 'website',
    locale: 'en_AE',
    siteName: 'FindInLocal',
    url: 'https://findinlocal.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindInLocal - Dubai Local Services Directory',
      },
    ],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-15QMLW1NP6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-15QMLW1NP6');
            `,
          }}
        />
        
        {/* Structured Data for Local Business Directory */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "FindInLocal",
              "description": "Dubai's premier local services directory for cleaning, moving, plumbing, and home services",
              "url": "https://findinlocal.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://findinlocal.com/search?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}