import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Scripts from '@/components/Script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    'FindInLocal - Compare Cleaning, Moving, Plumbing, Electrician, AC Repair & Pest Control Companies in Dubai',
  description:
    'FindInLocal helps you discover and compare trusted cleaning, moving, plumbing, electrician, AC repair, and pest control companies in Dubai. We are not a service provider — we connect you with verified local businesses.',
  keywords:
    'cleaning services Dubai, moving companies Dubai, plumbing Dubai, electrician Dubai, AC repair Dubai, pest control Dubai, maid service, home services Dubai, FindInLocal, Dubai service directory',
  openGraph: {
    title:
      'FindInLocal - Discover Trusted Cleaning, Moving & Home Services in Dubai',
    description:
      'Compare the best cleaning, plumbing, moving, and AC repair companies across Dubai. FindInLocal lists verified local businesses for your home and office needs.',
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
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://findinlocal.com',
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
        <meta name="robots" content="index,follow" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FindInLocal',
              url: 'https://findinlocal.com',
              logo: 'https://findinlocal.com/logo.png',
              description:
                'FindInLocal is Dubai’s trusted directory for cleaning, moving, plumbing, electrician, AC repair, and pest control companies.',
              sameAs: [
                'https://www.facebook.com/findinlocal',
                'https://www.instagram.com/findinlocal',
              ],
            }),
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How can I find trusted cleaning companies in Dubai?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'You can browse verified cleaning companies on FindInLocal by visiting the Cleaning Services category. Each listing shows ratings, reviews, and contact details so you can choose confidently.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is FindInLocal a service provider?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'No, FindInLocal is not a service provider. We list verified businesses that already offer cleaning, moving, plumbing, and other services in Dubai.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which services are listed on FindInLocal?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'FindInLocal lists popular categories like cleaning, moving, plumbing, electrician, AC repair, and pest control companies across Dubai.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I contact a listed company?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                      'Each company profile on FindInLocal includes direct contact options such as call, WhatsApp, or website links. You can contact them directly without any commission or middleman.',
                  },
                },
              ],
            }),
          }}
        />
      </head>

      <body className={inter.className}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
