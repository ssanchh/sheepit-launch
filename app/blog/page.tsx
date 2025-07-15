'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

// This will be replaced with dynamic content later
const blogPosts = [
  {
    slug: 'why-we-built-sheep-it',
    title: 'Why We Built Sheep It: Democratizing Product Launches',
    excerpt: 'The story behind Sheep It and our mission to help indie makers launch successfully without the politics of traditional platforms.',
    author: 'Santiago Sanchez',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Announcement'
  },
  {
    slug: 'perfect-product-launch-checklist',
    title: 'The Perfect Product Launch Checklist for Indie Makers',
    excerpt: 'A comprehensive guide to launching your product successfully on Sheep It. From pre-launch to post-launch strategies.',
    author: 'Sheep It Team',
    date: '2025-01-14',
    readTime: '8 min read',
    category: 'Guide'
  },
  {
    slug: 'launch-week-best-practices',
    title: 'Launch Week Best Practices: Lessons from 100+ Launches',
    excerpt: 'What we\'ve learned from analyzing successful launches and how you can apply these insights to your next launch.',
    author: 'Sheep It Team',
    date: '2025-01-13',
    readTime: '6 min read',
    category: 'Tips'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            Sheep It Blog
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Launch tips, maker stories, and insights from the indie startup community.
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 hover:border-orange-400 transition-all">
              <div className="flex items-center gap-4 text-sm text-[#666666] mb-3">
                <span className="bg-[#F5F5F5] px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2 hover:text-orange-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-[#666666] mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#999999]">
                  By {post.author}
                </span>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                >
                  Read more
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-orange-50 rounded-xl border-4 border-orange-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Have a Story to Share?
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            We're always looking for guest posts from makers who have launched their products. 
            Share your journey and get a valuable backlink!
          </p>
          <a
            href="mailto:blog@sheepit.io?subject=Guest Post Proposal"
            className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
          >
            Submit Guest Post
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}