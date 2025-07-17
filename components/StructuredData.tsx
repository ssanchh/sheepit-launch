export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sheep It",
    "alternateName": "SheepIt",
    "url": "https://sheepit.io",
    "logo": "https://sheepit.io/assets/images/logo.svg",
    "description": "Weekly product launch and discovery platform for indie startups, solo founders, and builders. Launch your product every Monday and get real feedback from the community.",
    "sameAs": [
      "https://twitter.com/sheep_it",
      "https://www.linkedin.com/company/sheepit",
      "https://github.com/sheepit"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@sheepit.io",
      "contactType": "customer support",
      "availableLanguage": ["English"]
    },
    "foundingDate": "2025",
    "founders": [
      {
        "@type": "Person",
        "name": "Santiago Sanchez"
      }
    ]
  }

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sheep It",
    "alternateName": "SheepIt - Weekly Launchpad for Indie Startups",
    "url": "https://sheepit.io",
    "description": "Launch your indie product every Monday. Get votes, feedback, and win a spot in our weekly newsletter reaching thousands of potential customers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sheepit.io/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const startupServiceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Weekly Product Launch Platform",
    "serviceType": "Startup Launch Platform",
    "provider": {
      "@type": "Organization",
      "name": "Sheep It"
    },
    "description": "A weekly product launch platform where indie makers submit products, get community votes, and winners are featured in our newsletter.",
    "offers": {
      "@type": "Offer",
      "name": "Weekly Product Launch",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(startupServiceData) }}
      />
    </>
  )
}