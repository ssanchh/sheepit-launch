import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sheepit.io'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/how-it-works',
    '/pricing',
    '/submit',
    '/winners',
    '/past-launches',
    '/supporters',
    '/privacy',
    '/terms-and-conditions',
    '/refund',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // You can add dynamic pages here later (like individual product pages)
  
  return staticPages
}