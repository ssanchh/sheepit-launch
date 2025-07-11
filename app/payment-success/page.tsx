'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CheckCircle, Zap, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentType, setPaymentType] = useState<string>('')
  
  useEffect(() => {
    const type = searchParams.get('type')
    if (!type) {
      router.push('/dashboard')
    } else {
      setPaymentType(type)
    }
  }, [searchParams, router])

  const getPaymentInfo = () => {
    switch (paymentType) {
      case 'skip_queue':
        return {
          icon: Zap,
          title: 'Queue Skip Activated!',
          description: 'Your product has been moved up in the queue. It will launch sooner!',
          nextSteps: [
            'Your product position has been updated',
            'You\'ll receive an email when your product goes live',
            'Check your dashboard to see your new queue position'
          ]
        }
      case 'featured_product':
        return {
          icon: Crown,
          title: 'Featured Product Activated!',
          description: 'Your product will be featured at the top of the homepage for one week.',
          nextSteps: [
            'Your product will be prominently displayed',
            'Featured badge added to your product',
            'Increased visibility for 7 days'
          ]
        }
      default:
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          nextSteps: []
        }
    }
  }

  const info = getPaymentInfo()
  const Icon = info.icon

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-[#2D2D2D] mb-4">
            {info.title}
          </h1>
          <p className="text-lg text-[#666666] mb-8">
            {info.description}
          </p>

          {/* Next Steps */}
          {info.nextSteps.length > 0 && (
            <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#2D2D2D] mb-3">What happens next:</h3>
              <ul className="space-y-2">
                {info.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#666666]">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard?tab=products"
              className="inline-flex items-center justify-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              View My Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard?tab=payments"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2D2D2D] border-2 border-[#E5E5E5] px-6 py-3 rounded-lg font-medium hover:bg-[#F5F5F5] transition-colors"
            >
              View Receipt
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-[#666666]">
          <p>
            A receipt has been sent to your email address.
          </p>
          <p className="mt-2">
            Need help? <a href="mailto:support@sheep-it.com" className="text-orange-600 hover:text-orange-700">Contact support</a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCFA]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1E1E1E]"></div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}