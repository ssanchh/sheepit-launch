'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ExternalLink } from 'lucide-react'

const supporters = [
  {
    name: 'Example Startup',
    description: 'Description of what they do',
    url: 'https://example.com',
    logo: '/path-to-logo.png'
  },
  // Add more supporters here
]

export default function SupportersPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            Friends of Sheep It
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Amazing companies and makers who support the indie community. 
            Want to be featured here? <a href="mailto:support@sheepit.io" className="text-orange-600 hover:underline">Get in touch</a>.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {supporters.map((supporter, index) => (
            <a
              key={index}
              href={supporter.url}
              target="_blank"
              rel="noopener"
              className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 hover:border-orange-400 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D] group-hover:text-orange-600 transition-colors">
                    {supporter.name}
                  </h3>
                  <p className="text-sm text-[#666666] mt-1">
                    {supporter.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#999999] group-hover:text-orange-600 transition-colors" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl border-4 border-[#E5E5E5] p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Backlink Exchange Program
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            Add a link to Sheep It from your website and we'll feature you here. 
            Great for SEO and supporting the indie maker community!
          </p>
          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6">
            <code className="text-sm text-[#2D2D2D]">
              {`<a href="https://sheepit.io" rel="dofollow">Sheep It - Where indie makers launch together</a>`}
            </code>
          </div>
          <a
            href="mailto:support@sheepit.io?subject=Backlink Exchange"
            className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
          >
            Apply for Exchange
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}