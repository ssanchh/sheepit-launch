'use client'

import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export default function MVPBuildingService() {
  return (
    <Link href="/mvp-service" className="block mb-6">
      <div className="relative bg-gradient-to-br from-purple-50 to-white rounded-xl border-4 border-[#E5E5E5] hover:border-purple-400 transition-all cursor-pointer group">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center border border-purple-200 group-hover:bg-purple-200 transition-colors">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#2D2D2D] group-hover:text-purple-600 transition-colors">
                Need an MVP? We build it in 2 weeks
              </h3>
              <p className="text-sm text-[#666666] mt-1">
                $2,000 flat • Full-stack web app • Launch ready
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}