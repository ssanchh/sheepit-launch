'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

export default function MVPBuildingService() {
  const features = [
    'Full-stack web app (React + Node.js or similar)',
    'Up to 3 core features',
    'Mobile-responsive design',
    'Basic user authentication',
    'Deployment to production',
    '30 days of bug fixes',
    'Automatic submission to next Monday\'s batch'
  ]

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-4 border-[#E5E5E5] hover:border-purple-400 transition-all duration-300 p-6 group">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">
            From Idea to Launch in 2 Weeks
          </h2>
          <p className="text-sm text-[#666666] max-w-xl mx-auto">
            Need an MVP before you can launch? We'll build your MVP in 14 days for $2,000 flat.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 text-sm">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-[#666666] text-xs">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/mvp-service"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors group"
          >
            Start Building
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}