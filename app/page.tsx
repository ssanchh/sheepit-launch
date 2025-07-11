'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import NewsletterSignup from '@/components/NewsletterSignup'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '@/types/database'
import './animations.css'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithVotes[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredProduct, setFeaturedProduct] = useState<ProductWithVotes | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadApprovedProducts()
  }, [])

  const loadApprovedProducts = async () => {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get approved products with user information and vote counts
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        users!created_by (
          first_name,
          last_name,
          handle
        )
      `)
      .eq('status', 'approved')
      .eq('is_live', true)  // Only show products that are currently live
      .order('created_at', { ascending: false })

    if (!error && products) {
      // Check for featured products
      const { data: featuredPurchases } = await supabase
        .from('featured_purchases')
        .select('product_id')
        .eq('active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString())

      const featuredProductIds = featuredPurchases?.map(fp => fp.product_id) || []

      // Get vote counts and user votes for each product
      const productsWithVotes = await Promise.all(
        products.map(async (product: any) => {
          // Get total vote count
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)

          // Check if current user has voted for this product
          let userVote = null
          if (user) {
            const { data: voteData } = await supabase
              .from('votes')
              .select('*')
              .eq('product_id', product.id)
              .eq('user_id', user.id)
              .single()
            
            userVote = voteData
          }

          // Check if product is featured
          const isFeatured = featuredProductIds.includes(product.id)

          return {
            ...product,
            votes: [],
            vote_count: count || 0,
            user_vote: userVote,
            is_featured_paid: isFeatured
          }
        })
      )

      // Sort by vote count (highest first)
      productsWithVotes.sort((a, b) => b.vote_count - a.vote_count)
      
      // Set featured product if exists (paid featured takes priority)
      const featured = productsWithVotes.find(p => p.is_featured_paid || p.featured)
      if (featured) {
        setFeaturedProduct(featured)
        const remainingProducts = productsWithVotes.filter(p => p.id !== featured.id)
        setProducts(remainingProducts)
        setFilteredProducts(remainingProducts)
      } else {
        setProducts(productsWithVotes)
        setFilteredProducts(productsWithVotes)
      }
    }
    setLoading(false)
  }

  const handleVoteUpdate = () => {
    loadApprovedProducts()
  }

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.tagline.toLowerCase().includes(lowerQuery) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    )
    
    setFilteredProducts(filtered)
  }, [products])

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-[900px] mx-auto px-6 py-8">
        {/* Hero Section for Founders */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
            Your product, thousands of early adopters
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Launch alongside fellow indie makers every Monday. Winners get featured to 50k+ subscribers, quality backlinks, and real users who love trying new products.
          </p>
        </div>

        {/* Featured Product Section */}
        {featuredProduct ? (
          <div className="mb-10">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">Featured</span>
                  <h3 className="text-lg font-semibold text-[#2D2D2D]">Today's Featured Launch</h3>
                </div>
                <CountdownTimer />
              </div>
              
              <ProductCard 
                product={featuredProduct}
                rank={0}
                onVoteUpdate={handleVoteUpdate}
                totalProducts={1}
                leadingVotes={featuredProduct.vote_count}
                isTop3={false}
                isFeatured={true}
              />
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-dashed border-orange-300">
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                  This featured spot could be yours
                </h3>
                <p className="text-[#666666] mb-4">
                  Get premium visibility with guaranteed top placement
                </p>
                <a 
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105"
                >
                  <span>✨</span>
                  <span>Get Featured - $49</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Get Featured Banner */}
        <div className="mb-8">
          <div className="bg-[#2D2D2D] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h4 className="text-white font-semibold">Get Featured</h4>
                <p className="text-gray-300 text-sm">Premium visibility for your product. Limited spots available.</p>
              </div>
            </div>
            <a 
              href="/pricing"
              className="bg-white text-[#2D2D2D] px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-2xl font-bold text-[#2D2D2D]">{products.length}</div>
                <div className="text-sm text-[#666666]">Launching this week</div>
              </div>
              <div className="border-l border-[#E5E5E5] pl-8">
                <div className="text-2xl font-bold text-indigo-600">{products.reduce((sum, p) => sum + p.vote_count, 0)}</div>
                <div className="text-sm text-[#666666]">Total votes</div>
              </div>
            </div>
            <div className="text-right">
              <CountdownTimer />
            </div>
          </div>
        </div>


        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search products by name, tagline, or description..."
            className="max-w-lg mx-auto"
          />
        </div>

        {/* This Week's Launches */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#2D2D2D]">
            {searchQuery ? `Search results for "${searchQuery}"` : "This week's launches"}
          </h2>
          <p className="text-sm text-[#666666] mt-1">
            {searchQuery ? `Found ${filteredProducts.length} products` : "Vote for your favorites • Top 3 win prizes"}
          </p>
        </div>

        {/* Products List */}
        <section>
          
          {loading ? (
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-16">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#E5E5E5] border-t-[#2D2D2D]"></div>
                <p className="text-sm text-[#666666] mt-4">Loading this week's launches...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  rank={index + 1}
                  onVoteUpdate={handleVoteUpdate}
                  totalProducts={filteredProducts.length}
                  leadingVotes={filteredProducts[0]?.vote_count || 0}
                  isTop3={!searchQuery && index < 3}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-16 text-center">
              <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📦'}</div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                {searchQuery ? 'No products found' : 'No live products this week'}
              </h3>
              <p className="text-[#666666] mb-6">
                {searchQuery 
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'The new week hasn\'t started yet or products are still in queue. Check back soon!'
                }
              </p>
              <div className="flex gap-3 justify-center">
                <a 
                  href="/submit"
                  className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
                >
                  Submit Your Product
                </a>
                <a 
                  href="/past-launches"
                  className="inline-flex items-center gap-2 bg-white text-[#666666] border border-[#E5E5E5] px-6 py-3 rounded-lg font-medium hover:border-[#D5D5D5] transition-colors"
                >
                  View Past Launches
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center py-8 border-t border-[#E5E5E5]">
          <p className="text-sm text-[#666666] mb-4">
            Ready to get your product in front of 50k+ makers?
          </p>
          <a 
            href="/submit" 
            className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
          >
            <span>🚀</span>
            <span>Launch Your Product</span>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
} 