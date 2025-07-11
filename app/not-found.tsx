import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-[#999999]" />
          </div>
          
          <h1 className="text-6xl font-bold text-[#2D2D2D] mb-3">404</h1>
          
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-3">
            Page not found
          </h2>
          
          <p className="text-[#666666] mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Check the URL or return to the homepage.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors font-medium"
            >
              Go Home
            </Link>
            <Link
              href="/submit"
              className="bg-white text-[#2D2D2D] border border-[#E5E5E5] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors font-medium"
            >
              Submit Product
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}