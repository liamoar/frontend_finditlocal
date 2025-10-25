import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FindItLocal - Discover Trusted Local Services in Dubai | Home Services Directory',
  description: 'Find the best local service providers in Dubai. Compare ratings, prices, and services for cleaning, moving, plumbing, electrical, AC repair, pest control and more across all Dubai areas.',
  keywords: 'local services dubai, home services, cleaning, moving, plumbing, electrician, AC repair, pest control, carpentry, painting, home renovation, laundry, maid service, appliance repair',
  openGraph: {
    title: 'FindItLocal - Discover Trusted Local Services in Dubai',
    description: 'Find trusted local service providers across Dubai for all your home and business needs.',
    type: 'website',
    locale: 'en_AE',
    siteName: 'FindItLocal',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}