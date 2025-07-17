import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sheepit.io'
  const now = new Date()
  
  // High priority pages
  const highPriorityPages = [
    { route: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { route: '/submit', changeFrequency: 'weekly' as const, priority: 0.9 },
    { route: '/how-it-works', changeFrequency: 'monthly' as const, priority: 0.8 },
    { route: '/pricing', changeFrequency: 'weekly' as const, priority: 0.8 },
  ]
  
  // Medium priority pages
  const mediumPriorityPages = [
    { route: '/mvp-service', changeFrequency: 'weekly' as const, priority: 0.7 },
    { route: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
    { route: '/winners', changeFrequency: 'weekly' as const, priority: 0.6 },
    { route: '/past-launches', changeFrequency: 'weekly' as const, priority: 0.6 },
  ]
  
  // Low priority pages
  const lowPriorityPages = [
    { route: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
    { route: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { route: '/terms-and-conditions', changeFrequency: 'yearly' as const, priority: 0.3 },
    { route: '/refund', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]
  
  const allPages = [...highPriorityPages, ...mediumPriorityPages, ...lowPriorityPages]
  
  const staticPages = allPages.map(({ route, changeFrequency, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
  
  // Add newsletter pages
  const newsletterPages = [
    {
      url: `${baseUrl}/newsletter/why-the-f-i-built-sheep-it`,
      lastModified: new Date('2025-07-17'),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }
  ]
  
  return [...staticPages, ...newsletterPages]
}