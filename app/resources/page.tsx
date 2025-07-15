'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Download, CheckCircle, ExternalLink, BookOpen } from 'lucide-react'

const resources = [
  {
    title: 'Product Launch Checklist',
    description: 'A comprehensive 30-point checklist to ensure your launch goes smoothly.',
    type: 'Checklist',
    downloadable: true,
    external: false
  },
  {
    title: 'Launch Day Timeline Template',
    description: 'Hour-by-hour guide for your launch day activities and social media posts.',
    type: 'Template',
    downloadable: true,
    external: false
  },
  {
    title: 'Press Release Template',
    description: 'Professional press release template specifically for indie product launches.',
    type: 'Template',
    downloadable: true,
    external: false
  }
]

const externalResources = [
  {
    title: 'Indie Hackers',
    description: 'Community of indie makers sharing experiences and advice.',
    url: 'https://indiehackers.com',
    category: 'Community'
  },
  {
    title: 'Startup School by Y Combinator',
    description: 'Free online course for entrepreneurs and startup founders.',
    url: 'https://startupschool.org',
    category: 'Education'
  },
  {
    title: 'How to Start a Startup (Paul Graham)',
    description: 'Essential essays on building and launching startups.',
    url: 'http://paulgraham.com/articles.html',
    category: 'Reading'
  }
]

const launchTips = [
  'Build in public and share your progress regularly',
  'Gather email signups before launch day',
  'Create engaging visual content (GIFs, screenshots)',
  'Engage with your community, don\'t just promote',
  'Time your launch for maximum visibility',
  'Prepare for the post-launch follow-up'
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            Launch Resources
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Everything you need to launch your product successfully on Sheep It and beyond.
          </p>
        </div>

        {/* Downloadable Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">
            Free Downloads
          </h2>
          <div className="grid gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#2D2D2D]">
                        {resource.title}
                      </h3>
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-[#666666] mb-4">
                      {resource.description}
                    </p>
                  </div>
                  <button className="bg-[#2D2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#1D1D1D] transition-colors flex items-center gap-2 ml-4">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">
            Quick Launch Tips
          </h2>
          <div className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6">
            <div className="grid gap-3">
              {launchTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-[#666666]">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* External Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">
            Recommended Reading
          </h2>
          <div className="grid gap-4">
            {externalResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 hover:border-orange-400 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#2D2D2D] group-hover:text-orange-600 transition-colors">
                        {resource.title}
                      </h3>
                      <span className="bg-[#F5F5F5] text-[#666666] px-2 py-1 rounded-full text-xs font-medium">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-[#666666]">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#999999] group-hover:text-orange-600 transition-colors ml-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-orange-50 rounded-xl border-4 border-orange-200 p-8 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Get Launch Tips Weekly
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for weekly launch tips, maker stories, and exclusive resources.
          </p>
          <a
            href="/#newsletter"
            className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
          >
            Subscribe to Newsletter
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}