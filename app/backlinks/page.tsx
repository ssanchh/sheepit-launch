'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { createClient } from '@/utils/supabase/client'
import { ProductWithUser } from '@/types/database'
import { LinkIcon, CheckCircle, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface BacklinkProduct extends ProductWithUser {
  backlink?: {
    anchor_text: string
    target_url: string
    is_dofollow: boolean
  }
}

export default function BacklinksPage() {
  const [products, setProducts] = useState<BacklinkProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBacklinkProducts()
  }, [])

  const loadBacklinkProducts = async () => {
    const supabase = createClient()
    
    // Get products with backlinks
    const { data: backlinks } = await supabase
      .from('product_backlinks')
      .select(`
        *,
        products!inner(
          *,
          users!created_by(
            first_name,
            last_name,
            handle,
            avatar_url
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (backlinks) {
      const backlinkProducts = backlinks.map((bl: any) => ({
        ...bl.products,
        user: bl.products.users,
        backlink: {
          anchor_text: bl.anchor_text,
          target_url: bl.target_url,
          is_dofollow: bl.is_dofollow
        }
      }))
      setProducts(backlinkProducts)
    }
    
    setLoading(false)
  }

  const copyEmbedCode = (product: BacklinkProduct) => {
    const embedCode = `<a href="https://sheepit.io/product/${product.id}" rel="${product.backlink?.is_dofollow ? 'dofollow' : 'nofollow'}" target="_blank">${product.backlink?.anchor_text || product.name} - Launched on Sheep It</a>`
    
    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <LinkIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D2D2D] mb-4">
            High-Quality Backlinks
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Products that earned guaranteed backlinks through our Premium and Featured launches. 
            All links are DoFollow and help boost your SEO.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-[#2D2D2D] mb-2">DoFollow Links</h3>
            <p className="text-sm text-[#666666]">
              All premium backlinks pass SEO value to help improve your search rankings
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-[#2D2D2D] mb-2">Permanent Links</h3>
            <p className="text-sm text-[#666666]">
              Once earned, your backlink stays here forever with no expiration
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-[#2D2D2D] mb-2">Growing Authority</h3>
            <p className="text-sm text-[#666666]">
              As Sheep It grows, so does the value of your backlink
            </p>
          </div>
        </div>

        {/* Products with Backlinks */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#E5E5E5] border-t-[#2D2D2D]"></div>
          </div>
        ) : products.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6">
              Products with Guaranteed Backlinks ({products.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {product.logo_url ? (
                      <Image
                        src={product.logo_url}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                        <span className="text-[#666666] font-medium">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2D2D2D]">{product.name}</h3>
                      <p className="text-sm text-[#666666]">{product.tagline}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-[#666666]" />
                        <span className="text-sm text-[#666666]">
                          {product.backlink?.is_dofollow ? 'DoFollow' : 'NoFollow'} Link
                        </span>
                      </div>
                      <a
                        href={product.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    
                    <button
                      onClick={() => copyEmbedCode(product)}
                      className="w-full flex items-center justify-center gap-2 bg-[#2D2D2D] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1D1D1D] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Embed Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
              No backlinks yet
            </h3>
            <p className="text-[#666666] mb-6">
              Be the first to get a guaranteed backlink with a Premium or Featured launch
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              View Pricing Options
            </a>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-3">
            Want a Guaranteed Backlink?
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            Premium and Featured launches come with guaranteed DoFollow backlinks that help boost your SEO
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/pricing"
              className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              See Pricing Options
            </a>
            <a
              href="/submit"
              className="bg-white text-[#2D2D2D] border border-[#E5E5E5] px-6 py-3 rounded-lg font-medium hover:border-[#D5D5D5] transition-colors"
            >
              Submit Product
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}