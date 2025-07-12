'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import NewsletterSignup from '@/components/NewsletterSignup'
import FirstLaunchCountdown from '@/components/FirstLaunchCountdown'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '@/types/database'
import './animations.css'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithVotes[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)
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
              .limit(1)
            
            userVote = voteData && voteData.length > 0 ? voteData[0] : null
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
      
      // Set all products (no featured separation)
      setProducts(productsWithVotes)
      setFilteredProducts(productsWithVotes)
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
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section for Founders */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#2D2D2D] mb-3 sm:mb-4 px-4 sm:px-0">
            Where indie makers launch together
          </h1>
          <p className="text-sm sm:text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Join the weekly launch party every Monday. Get real feedback, connect with fellow builders, and reach early adopters who genuinely care about new products. Winners earn a spot in our weekly newsletter.
          </p>
        </div>

        {/* First Launch Announcement */}
        <FirstLaunchCountdown />

        {/* Stats Bar - Only show after first launch */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#2D2D2D]">{products.length}</div>
                  <div className="text-xs sm:text-sm text-[#666666]">Launching this week</div>
                </div>
                <div className="border-l border-[#E5E5E5] pl-4 sm:pl-8">
                  <div className="text-xl sm:text-2xl font-bold text-indigo-600">{products.reduce((sum, p) => sum + p.vote_count, 0)}</div>
                  <div className="text-xs sm:text-sm text-[#666666]">Total votes</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <CountdownTimer />
              </div>
            </div>
          </div>
        )}


        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search products by name, tagline, or description..."
            className="max-w-lg mx-auto"
          />
        </div>

        {/* This Week's Launches */}
        {products.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2D2D2D]">
              {searchQuery ? `Search results for "${searchQuery}"` : "This week's launches"}
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              {searchQuery ? `Found ${filteredProducts.length} products` : "Vote for your favorites • Top 3 win prizes"}
            </p>
          </div>
        )}

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
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 sm:p-16 text-center">
              <div className="text-5xl sm:text-6xl mb-4">{searchQuery ? '🔍' : '🚀'}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2D2D] mb-2">
                {searchQuery ? 'No products found' : 'The queue is building!'}
              </h3>
              <p className="text-sm sm:text-base text-[#666666] mb-6 px-4 sm:px-0">
                {searchQuery 
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'Products are gathering in the queue for our inaugural launch on August 4th. Be part of the first batch!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#2D2D2D] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors text-sm sm:text-base"
                >
                  Submit Your Product
                </a>
                <a 
                  href="/past-launches"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#666666] border border-[#E5E5E5] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:border-[#D5D5D5] transition-colors text-sm sm:text-base"
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
        <div className="mt-12 sm:mt-16 text-center py-6 sm:py-8 border-t border-[#E5E5E5]">
          <p className="text-xs sm:text-sm text-[#666666] mb-4">
            Ready to get your product in front of 50k+ makers?
          </p>
          <a 
            href="/submit" 
            className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors text-sm sm:text-base"
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