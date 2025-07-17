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