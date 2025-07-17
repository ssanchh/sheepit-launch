'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, Mail, ArrowRight } from 'lucide-react'

// Newsletter content - will be replaced with dynamic content from Beehiiv API later
const newsletters = [
  {
    id: '1',
    slug: 'why-the-f-i-built-sheep-it',
    issue: 1,
    title: 'Why the f*** I built Sheep It',
    excerpt: "I'm an accountant who has nothing to do with tech. But I'm building a platform for indie makers. Here's the confession of how it all started.",
    date: '2025-07-17',
    category: 'Founder Story',
    beehiivUrl: 'https://santiagos-newsletter-a2dca9.beehiiv.com/p/why-the-f-i-built-sheep-it',
    content: `
      <p>I'm Santiago, and I have a confession: I studied accounting, got the degree, worked in the field... and I fucking hate it. Like, genuinely despise everything about it. My colleagues still make that confused face when I tell them this.</p>
      
      <p>Yeah, that's been my life for years.</p>
      
      <h2>The Breaking Point</h2>
      
      <p>I've been building side projects for years, trying to escape the corporate accounting world. Some failed, some worked okay, but none gave me the freedom I desperately wanted.</p>
      
      <p>Then I discovered the indie maker community. Holy shit. People were building cool stuff, launching products, and actually making money from their ideas. No VCs, no bullshit, just builders building.</p>
      
      <h2>Why Sheep It?</h2>
      
      <p>I noticed something: indie makers struggle to get initial traction. Product Hunt is dominated by big companies with marketing budgets. Twitter is noisy. Reddit hates self-promotion.</p>
      
      <p>What if there was a place specifically for indie makers to launch? A weekly event where the community actually wants to discover new products?</p>
      
      <p>That's Sheep It. Every Monday, makers launch together. The community votes. Winners get featured in this newsletter.</p>
      
      <p>Simple. Fair. Community-driven.</p>
      
      <h2>The First Launch</h2>
      
      <p>August 4th is our first official launch day. I'm scared shitless but also excited. We already have makers signing up, preparing their products.</p>
      
      <p>This newsletter will showcase the weekly winners, share their stories, and help you discover tools you actually need.</p>
      
      <p>No corporate bullshit. No paid placements. Just the best indie products, voted by the community.</p>
      
      <p>Welcome to Sheep It. Let's build something together.</p>
      
      <p>- Santiago<br/>
      Founder, Sheep It<br/>
      (Still an accountant, but not for long)</p>
    `
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            Newsletter Archive
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Past editions of our weekly newsletter featuring launch highlights, maker stories, and community updates.
          </p>
        </div>

        <div className="space-y-6">
          {newsletters.length > 0 ? newsletters.map((newsletter) => (
            <article key={newsletter.slug} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 hover:border-orange-400 transition-all">
              <div className="flex items-center gap-4 text-sm text-[#666666] mb-3">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                  Issue #{newsletter.issue}
                </span>
                <span className="bg-[#F5F5F5] px-3 py-1 rounded-full text-xs font-medium">
                  {newsletter.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(newsletter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2 hover:text-orange-600 transition-colors">
                <Link href={`/newsletter/${newsletter.slug}`}>
                  {newsletter.title}
                </Link>
              </h2>
              
              <p className="text-[#666666] mb-4">
                {newsletter.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#999999] flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Newsletter
                </span>
                <Link 
                  href={`/newsletter/${newsletter.slug}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                >
                  Read issue
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          )) : (
            <div className="bg-white rounded-xl border-4 border-[#E5E5E5] p-12 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                First Newsletter Coming Soon
              </h3>
              <p className="text-[#666666] mb-6">
                Our first newsletter will be sent after our inaugural launch on August 4th. 
                Subscribe to get it in your inbox!
              </p>
              <a
                href="/#newsletter"
                className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
              >
                Subscribe to Newsletter
              </a>
            </div>
          )}
        </div>

        {/* Newsletter Signup CTA */}
        <div className="mt-16 bg-orange-50 rounded-xl border-4 border-orange-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Get Weekly Updates
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get weekly launch highlights, maker stories, and be the first to read new issues.
          </p>
          <a
            href="/#newsletter"
            className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
          >
            Subscribe Now
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}