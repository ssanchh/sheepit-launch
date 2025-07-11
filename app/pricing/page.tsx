'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { Home, Trophy, Link as LinkIcon, Clock, Zap, Crown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProductSelectionModal from '@/components/ProductSelectionModal'
import { toast } from 'sonner'
import { useLoginModal } from '@/contexts/LoginModalContext'

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showProductModal, setShowProductModal] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'skip_queue' | 'featured_product'>('skip_queue')
  const { openLoginModal } = useLoginModal()

  const handlePremiumPurchase = () => {
    if (!user) {
      openLoginModal('/pricing')
      return
    }

    setPurchaseType('skip_queue')
    setShowProductModal(true)
  }

  const handleFeaturedPurchase = () => {
    if (!user) {
      openLoginModal('/pricing')
      return
    }

    setPurchaseType('featured_product')
    setShowProductModal(true)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-medium text-[#2D2D2D] mb-2">
            Choose your launch
          </h1>
          <p className="text-sm text-[#666666]">
            Free forever, with options to stand out
          </p>
        </div>


        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Free Launch */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Standard Launch</h3>
              <div className="text-3xl font-medium text-[#2D2D2D]">Free</div>
            </div>

            <div className="space-y-4 mb-8 min-h-[240px]">
              <div className="flex items-start gap-3">
                <Home className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Live on homepage for one week</p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Badge for top 3 weekly winners</p>
              </div>
              <div className="flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Profile link if you win top 3</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Standard launch queue</p>
              </div>
            </div>

            <Link
              href="/submit"
              className="block text-center py-2.5 px-6 bg-[#F5F5F5] text-[#2D2D2D] rounded-lg text-sm font-medium hover:bg-[#EEEEEE] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Premium Launch */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Premium Launch</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-[#2D2D2D]">$35</span>
                <span className="text-sm text-[#999999]">/launch</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 min-h-[240px]">
              <div className="flex items-start gap-3">
                <Home className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Live on homepage for one week</p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Badge for top 3 weekly winners</p>
              </div>
              <div className="flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-[#2D2D2D] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Guaranteed profile link</p>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#2D2D2D] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Skip the queue</p>
              </div>
            </div>

            <button
              onClick={() => toast.info('Payment integration coming soon! We\'re setting up our payment provider.')}
              className="block w-full text-center py-2.5 px-6 bg-[#2D2D2D] text-white rounded-lg text-sm font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              Coming Soon
            </button>
          </div>

          {/* Featured Spot */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Featured Spot</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-[#2D2D2D]">$45</span>
                <span className="text-sm text-[#999999]">/week</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 min-h-[240px]">
              <div className="flex items-start gap-3">
                <Crown className="w-4 h-4 text-[#2D2D2D] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Premium placement at the top of the landing page</p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-4 h-4 text-[#2D2D2D] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Featured product badge</p>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-4 h-4 text-[#2D2D2D] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">High visibility to all visitors</p>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-4 h-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Cancel anytime</p>
              </div>
            </div>

            <button
              onClick={() => toast.info('Payment integration coming soon! We\'re setting up our payment provider.')}
              className="block w-full text-center py-2.5 px-6 bg-[#2D2D2D] text-white rounded-lg text-sm font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <p className="text-sm text-[#999999]">
            Join thousands of indie makers launching every week
          </p>
        </div>

        {/* Simple FAQ */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-6">Common questions</h2>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#2D2D2D]">
              How long is the standard queue?
            </h3>
            <p className="text-sm text-[#666666]">
              Usually 2-3 weeks. Premium launches skip the queue and go live next Monday.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#2D2D2D]">
              What's the difference between Premium and Featured?
            </h3>
            <p className="text-sm text-[#666666]">
              Premium gets you a faster launch and guaranteed link. Featured gives you the top spot on the homepage all week.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#2D2D2D]">
              Do featured products compete in the weekly voting?
            </h3>
            <p className="text-sm text-[#666666]">
              No, featured products have their own dedicated spot. The weekly competition is for non-featured products only.
            </p>
          </div>
        </div>
      </main>

      {/* Product Selection Modal */}
      {user && (
        <ProductSelectionModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          purchaseType={purchaseType}
          user={user}
        />
      )}
    </div>
  )
}