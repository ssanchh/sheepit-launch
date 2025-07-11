'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { Home, Trophy, Link as LinkIcon, Clock, Zap, Crown, CheckCircle, Users, Mail, BarChart3, Star, Eye } from 'lucide-react'
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
          <p className="text-sm text-[#666666] mb-8">
            Free forever, with options to stand out
          </p>
          
          {/* Service Description */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl p-6 text-left">
            <h2 className="text-lg font-medium text-[#2D2D2D] mb-3">What is Sheep It?</h2>
            <p className="text-sm text-[#666666] mb-4">
              Sheep It is a weekly product launch platform for indie makers. Every Monday, we showcase new products to our community of 50,000+ early adopters, tech enthusiasts, and fellow entrepreneurs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-[#2D2D2D] mb-1">Weekly Launches</div>
                <p className="text-[#666666]">New products go live every Monday for a 7-day voting period</p>
              </div>
              <div>
                <div className="font-medium text-[#2D2D2D] mb-1">Community Voting</div>
                <p className="text-[#666666]">Real users vote for their favorites, top 3 win prizes</p>
              </div>
              <div>
                <div className="font-medium text-[#2D2D2D] mb-1">Marketing Boost</div>
                <p className="text-[#666666]">Winners get featured to 50k+ subscribers and quality backlinks</p>
              </div>
            </div>
          </div>
        </div>


        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Free Launch */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Standard Launch</h3>
              <div className="text-3xl font-medium text-[#2D2D2D]">Free</div>
              <p className="text-xs text-[#999999] mt-1">Perfect for testing the waters</p>
            </div>

            <div className="space-y-4 mb-8 min-h-[320px]">
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">What you get:</div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Homepage listing for 7 days</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Community voting enabled</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Product page with comments</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Basic analytics dashboard</p>
              </div>
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mt-4 mb-3">If you win (Top 3):</div>
              <div className="flex items-start gap-3">
                <Trophy className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Winner badge on profile</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">Featured in 50k+ newsletter</p>
              </div>
              <div className="flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#666666]">DoFollow backlink (DA 40+)</p>
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
          <div className="bg-white rounded-xl border-2 border-orange-200 p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Premium Launch</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-[#2D2D2D]">$35</span>
                <span className="text-sm text-[#999999]">/launch</span>
              </div>
              <p className="text-xs text-[#999999] mt-1">Launch next Monday</p>
            </div>

            <div className="space-y-4 mb-8 min-h-[320px]">
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">Everything in Free, plus:</div>
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Skip the queue entirely</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">"Premium" badge on listing</p>
              </div>
              <div className="flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Guaranteed DoFollow backlink</p>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Advanced analytics</p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Priority support</p>
              </div>
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mt-4 mb-3">Launch timeline:</div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-[#666666]">Purchase by Sunday → Launch Monday</p>
                <p className="text-xs text-[#666666] mt-1">Skip 2-3 week wait time</p>
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
              <p className="text-xs text-[#999999] mt-1">Maximum visibility</p>
            </div>

            <div className="space-y-4 mb-8 min-h-[320px]">
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">Everything in Premium, plus:</div>
              <div className="flex items-start gap-3">
                <Crown className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Top spot above all listings</p>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">3x more visibility</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">"Featured" golden badge</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Priority in newsletter</p>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2D] font-medium">Real-time analytics</p>
              </div>
              <div className="text-xs font-medium text-[#999999] uppercase tracking-wider mt-4 mb-3">Placement details:</div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-[#666666]">7 full days of featured placement</p>
                <p className="text-xs text-[#666666] mt-1">Non-competing (no voting needed)</p>
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