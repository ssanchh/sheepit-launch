'use client'

import { useState } from 'react'
import { X, Zap, Crown, Check } from 'lucide-react'
import { toast } from 'sonner'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  type: 'skip_queue' | 'featured_product'
  onSuccess?: () => void
}

export default function PurchaseModal({ isOpen, onClose, product, type, onSuccess }: PurchaseModalProps) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const getModalContent = () => {
    if (type === 'skip_queue') {
      return {
        icon: Zap,
        title: 'Skip the Queue',
        price: '$35',
        description: 'Move to position #1 and launch next Monday',
        benefits: [
          'Jump from position #' + product.queue_position + ' to #1',
          'Launch as soon as next Monday',
          'Save weeks of waiting'
        ],
        buttonText: 'Continue to Payment'
      }
    } else {
      return {
        icon: Crown,
        title: 'Get Featured',
        price: '$45',
        period: '/week',
        description: 'Premium placement at the top of homepage',
        benefits: [
          'Top spot above all products',
          'Featured badge',
          '7 days of premium visibility'
        ],
        buttonText: 'Continue to Payment'
      }
    }
  }

  const content = getModalContent()
  const Icon = content.icon

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: type,
          productId: product.id
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#2D2D2D]">{content.title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#F5F5F5] rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
          
          <p className="text-base text-[#666666] mb-8">{content.description}</p>

          {/* Product Info */}
          <div className="bg-[#FDFCFA] rounded-lg p-5 mb-8 border border-[#F5F5F5]">
            <div className="flex items-center gap-3">
              {product.logo_url && (
                <img 
                  src={product.logo_url} 
                  alt={product.name}
                  className="w-12 h-12 rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base text-[#2D2D2D] truncate">{product.name}</h3>
                <p className="text-sm text-[#999999] truncate">{product.tagline}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-semibold text-[#2D2D2D]">{content.price}</span>
              {content.period && <span className="text-base text-[#999999]">{content.period}</span>}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-base text-[#666666]">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-4 px-6 bg-[#2D2D2D] text-white rounded-lg text-base font-medium hover:bg-[#1D1D1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : content.buttonText}
          </button>

          {/* Trust Text */}
          <p className="text-sm text-center text-[#999999] mt-6">
            Secure payment • Instant activation
          </p>
        </div>
      </div>
    </div>
  )
}