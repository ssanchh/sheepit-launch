'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import Header from '@/components/Header'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-orange-600" />
          </div>
          
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-3">
            Oops! Something went wrong
          </h1>
          
          <p className="text-[#666666] mb-8 max-w-md mx-auto">
            We're sorry for the inconvenience. The error has been logged and we'll look into it. 
            Please try again or return to the homepage.
          </p>

          {error.message && (
            <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-mono text-[#666666]">{error.message}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors font-medium"
            >
              Try Again
            </button>
            <a
              href="/"
              className="bg-white text-[#2D2D2D] border border-[#E5E5E5] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors font-medium"
            >
              Go Home
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}