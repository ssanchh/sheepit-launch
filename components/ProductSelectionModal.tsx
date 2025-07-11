'use client'

import { useState, useEffect } from 'react'
import { X, Package, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import PurchaseModal from './PurchaseModal'

interface ProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseType: 'skip_queue' | 'featured_product'
  user: any
}

export default function ProductSelectionModal({ isOpen, onClose, purchaseType, user }: ProductSelectionModalProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadProducts()
    }
  }, [isOpen, user])

  const loadProducts = async () => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setShowPurchaseModal(true)
  }

  const getTitle = () => {
    return purchaseType === 'skip_queue' ? 'Select Product to Launch' : 'Select Product to Feature'
  }

  const getDescription = () => {
    return purchaseType === 'skip_queue' 
      ? 'Choose which product you want to skip the queue with'
      : 'Choose which product you want to feature on the homepage'
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-[#F5F5F5]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">{getTitle()}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#F5F5F5] rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>
            <p className="text-sm text-[#666666]">{getDescription()}</p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D] mx-auto mb-4"></div>
                <p className="text-sm text-[#666666]">Loading your products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-[#999999]" />
                </div>
                <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">No products yet</h3>
                <p className="text-sm text-[#666666] mb-6">
                  You need to submit a product first before you can purchase upgrades
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full bg-[#FDFCFA] hover:bg-[#F5F5F5] rounded-lg p-4 border border-[#F5F5F5] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      {product.logo_url ? (
                        <img 
                          src={product.logo_url} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#999999]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#2D2D2D] truncate">{product.name}</h3>
                        <p className="text-sm text-[#666666] truncate">{product.tagline}</p>
                        {product.queue_position && !product.is_live && (
                          <p className="text-xs text-[#999999] mt-1">Queue position: #{product.queue_position}</p>
                        )}
                        {product.is_live && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 mt-1">
                            Live This Week
                          </span>
                        )}
                      </div>
                      <div className="text-[#999999] group-hover:text-[#666666] transition-colors">
                        →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedProduct && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false)
            setSelectedProduct(null)
            onClose()
          }}
          product={selectedProduct}
          type={purchaseType}
          onSuccess={() => {
            setShowPurchaseModal(false)
            setSelectedProduct(null)
            onClose()
          }}
        />
      )}
    </>
  )
}