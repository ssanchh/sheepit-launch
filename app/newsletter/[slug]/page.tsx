'use client'

import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, ArrowLeft, ExternalLink, Share2 } from 'lucide-react'
import { toast } from 'sonner'

// This will be replaced with dynamic content from Beehiiv API later
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

export default function NewsletterPage({ params }: { params: { slug: string } }) {
  const newsletter = newsletters.find(n => n.slug === params.slug)
  
  if (!newsletter) {
    notFound()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsletter.title,
        text: newsletter.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to archive
        </Link>

        <article className="bg-white rounded-2xl border-4 border-[#E5E5E5] p-8 sm:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-[#666666] mb-4">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                Issue #{newsletter.issue}
              </span>
              <span className="bg-[#F5F5F5] px-3 py-1 rounded-full text-xs font-medium">
                {newsletter.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(newsletter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              {newsletter.title}
            </h1>
            
            <p className="text-lg text-[#666666] mb-6">
              {newsletter.excerpt}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              <a
                href={newsletter.beehiivUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Beehiiv
              </a>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: newsletter.content }}
            style={{
              color: '#2D2D2D',
            }}
          />

          {/* Newsletter CTA */}
          <div className="mt-12 p-8 bg-orange-50 rounded-xl border-2 border-orange-200 text-center">
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">
              Get Weekly Launch Updates
            </h3>
            <p className="text-[#666666] mb-6">
              Join thousands of indie makers and discover the best new products every week.
            </p>
            <a
              href="/#newsletter"
              className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
            >
              Subscribe to Newsletter
            </a>
          </div>
        </article>
      </main>
      <style jsx global>{`
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #2D2D2D;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #666666;
        }
        .prose a {
          color: #ea580c;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #c2410c;
        }
      `}</style>
      <Footer />
    </div>
  )
}