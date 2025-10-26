'use client'

import { useEffect } from 'react'

export default function Scripts() {
  useEffect(() => {
    // Google Analytics 4
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-15QMLW1NP6'
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-15QMLW1NP6');
    `
    document.head.appendChild(script2)

    // Structured Data
    const script3 = document.createElement('script')
    script3.type = 'application/ld+json'
    script3.innerHTML = JSON.stringify({
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
    document.head.appendChild(script3)
  }, [])

  return null
}