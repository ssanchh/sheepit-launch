'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Check, Clock, Zap, Shield, ArrowLeft } from 'lucide-react'

export default function MVPServicePage() {
  const features = [
    { icon: Zap, title: 'Fast Development', description: '14-day turnaround from kickoff to launch' },
    { icon: Shield, title: 'Fixed Price', description: '$2,000 flat fee, no surprises' },
    { icon: Clock, title: 'Launch Ready', description: 'Automatic submission to next Monday batch' }
  ]

  const processSteps = [
    { day: 'Day 1-2', title: 'Discovery & Planning', description: 'We discuss your idea and define the MVP scope' },
    { day: 'Day 3-5', title: 'Design & Setup', description: 'UI/UX design and project architecture' },
    { day: 'Day 6-11', title: 'Development', description: 'Building your core features' },
    { day: 'Day 12-13', title: 'Testing & Polish', description: 'Bug fixes and final adjustments' },
    { day: 'Day 14', title: 'Launch', description: 'Deploy to production and submit to Sheep It' }
  ]

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            MVP Building Service
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Launch your idea in 2 weeks. We build your MVP while you focus on finding customers.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 text-center">
              <feature.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-[#2D2D2D] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#666666]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl border-4 border-[#E5E5E5] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Full-stack web application (React + Node.js or similar)',
              'Up to 3 core features based on your requirements',
              'Mobile-responsive design that works on all devices',
              'Basic user authentication (signup, login, password reset)',
              'Database setup and basic data models',
              'Deployment to production (Vercel, Netlify, or similar)',
              '30 days of bug fixes after launch',
              'Source code ownership transfers to you',
              'Basic documentation for future development',
              'Automatic submission to next Monday\'s Sheep It batch'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-[#666666]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-4 border-[#E5E5E5] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">The Process</h2>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full flex-shrink-0">
                  {step.day}
                </div>
                <div>
                  <h3 className="font-semibold text-[#2D2D2D] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#666666]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#2D2D2D] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Build Your MVP?
          </h2>
          <p className="text-gray-300 mb-6">
            Limited spots available. Start building today and launch in 2 weeks.
          </p>
          <a
            href="mailto:mvp@sheepit.io?subject=MVP%20Building%20Service%20Inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Get Started - $2,000
          </a>
          <p className="text-sm text-gray-400 mt-4">
            Contact us at mvp@sheepit.io
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}