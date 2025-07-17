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
    excerpt: "I'm an accountant who hates accounting, so naturally I'm building a launch platform for indie makers. Here's why.",
    date: '2025-07-17',
    category: 'Founder Story',
    beehiivUrl: 'https://santiagos-newsletter-a2dca9.beehiiv.com/p/why-the-f-i-built-sheep-it',
    content: `
      <p>You know that feeling when you're supposed to be doing spreadsheets but you're actually browsing Product Hunt wondering why the same VC-backed products always win?</p>
      
      <p>Yeah, that's been my life for years.</p>
      
      <p>I'm Santiago, and I have a confession: I studied accounting, got the degree, worked in the field... and I fucking hate it. Like, genuinely despise everything about it. My colleagues still make that confused face when I tell them this.</p>
      
      <p>But here's the thing - I've always been obsessed with startups. I have a Notion with 300+ business ideas analyzed in depth (yes, I counted). I read founder stories like other people watch Netflix. I almost opened an addiction clinic once, had everything ready, then moved to the US instead. That's a story for another day.</p>
      
      <p>The problem was, I thought you needed to be a "real" developer to build anything. Then AI came along and changed everything. Now I'm what we call a "vive coder" - someone who builds real products with AI tools. My first app, Captus, taught me an important lesson: don't build something you won't use yourself.</p>
      
      <h2>So why Sheep It?</h2>
      
      <p>Every Monday when I check Product Hunt, I see the same pattern: Cursor, Claude, [Insert Big Name] at the top with 1000+ upvotes. Then I scroll down and find 100 incredible indie products with 12 upvotes that nobody will ever discover.</p>
      
      <p>It's like watching David vs Goliath, except Goliath has a marketing team and David is coding in his bedroom after his day job.</p>
      
      <p>That's why I'm building Sheep It from my apartment in Uruguay. It's a weekly launch platform made specifically for indies, solos, and small teams. No algorithms favoring the big players. No "hunting" armies. Just small batches where everyone gets equal visibility.</p>
      
      <p>Christopher from Tiny Launch inspired me to actually do this. Seeing him build something similar with AI tools made me realize - holy shit, I can do this too. We're not competing; we're both trying to give indies more places to be seen.</p>
      
      <p>Here's what I believe: consistency compounds like crazy. I learned this at the gym - went from extremely skinny to actually having muscles after 3 years. You don't see changes from day 1 to day 2, but each day adds up. Same with building products. Same with creating communities.</p>
      
      <p>Sheep It launches August 4th. First batch, fresh start, equal playing field.</p>
      
      <p>I'm coding this on late afternoons and weekends while helping my father's business. Is it perfect? No. Will some people ignore it? Probably. But everything big started small. And I'd rather build something that helps 10 indie makers get discovered than keep making spreadsheets I'll never look at again.</p>
      
      <p>If you're building something and tired of shouting into the void, come launch with us. It's free, it's fair, and it's made by someone who gets the struggle.</p>
      
      <p>Because the best products shouldn't win just because they have the biggest teams.</p>
      
      <p>Santiago,<br/>
      Founder of Sheep It</p>
      
      <p><strong>P.S.</strong> - Yes, the name is ridiculous. That's the point. Serious is boring.</p>
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