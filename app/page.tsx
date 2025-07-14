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
  const [featuredProduct, setFeaturedProduct] = useState<ProductWithVotes | null>(null)

  useEffect(() => {
    loadApprovedProducts()
    loadFeaturedProduct()
  }, [])

  const loadApprovedProducts = async () => {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Use the optimized function to get all products with vote data in a single query
    const { data: productsData, error } = await supabase
      .rpc('get_products_with_votes', { user_id_param: user?.id || null })

    if (!error && productsData) {
      // Transform the data to match the expected format
      const productsWithVotes = productsData.map((product: any) => ({
        ...product,
        users: {
          first_name: product.creator_first_name,
          last_name: product.creator_last_name,
          handle: product.creator_handle
        },
        votes: [],
        vote_count: product.vote_count,
        user_vote: product.user_vote_id ? { id: product.user_vote_id } : null,
        is_featured_paid: product.is_featured_paid
      }))

      // Sort by vote count (highest first)
      productsWithVotes.sort((a: any, b: any) => b.vote_count - a.vote_count)
      
      // Set all products (no featured separation)
      setProducts(productsWithVotes)
      setFilteredProducts(productsWithVotes)
    }
    setLoading(false)
  }

  const loadFeaturedProduct = async () => {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get random featured product using the database function
    const { data: featuredId } = await supabase
      .rpc('get_random_featured_product')
    
    if (featuredId) {
      // Use optimized function to get product with vote data
      const { data: productsData } = await supabase
        .rpc('get_products_with_votes', { user_id_param: user?.id || null })
        .eq('id', featuredId)
      
      if (productsData && productsData.length > 0) {
        const product = productsData[0]
        
        setFeaturedProduct({
          ...product,
          users: {
            first_name: product.creator_first_name,
            last_name: product.creator_last_name,
            handle: product.creator_handle
          },
          votes: [],
          vote_count: product.vote_count,
          user_vote: product.user_vote_id ? { id: product.user_vote_id } : null,
          is_featured: true
        })
      }
    }
  }

  const handleVoteUpdate = async (productId: string, isVoting: boolean) => {
    // Optimistically update the UI immediately
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            vote_count: isVoting ? product.vote_count + 1 : product.vote_count - 1,
            user_vote: isVoting ? { id: 'temp-id' } : null
          }
        }
        return product
      })
    )
    
    setFilteredProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            vote_count: isVoting ? product.vote_count + 1 : product.vote_count - 1,
            user_vote: isVoting ? { id: 'temp-id' } : null
          }
        }
        return product
      })
    )
    
    // Update featured product if it's the one being voted on
    if (featuredProduct && featuredProduct.id === productId) {
      setFeaturedProduct({
        ...featuredProduct,
        vote_count: isVoting ? featuredProduct.vote_count + 1 : featuredProduct.vote_count - 1,
        user_vote: isVoting ? { id: 'temp-id' } : null
      })
    }
    
    // Then fetch the actual updated data for that specific product
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: voteData } = await supabase
        .rpc('get_product_vote_data', { 
          product_id_param: productId, 
          user_id_param: user.id 
        })
      
      if (voteData && voteData.length > 0) {
        const actualData = voteData[0]
        
        // Update with actual server data
        setProducts(prevProducts => 
          prevProducts.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                vote_count: actualData.vote_count,
                user_vote: actualData.user_vote_id ? { id: actualData.user_vote_id } : null
              }
            }
            return product
          })
        )
        
        setFilteredProducts(prevProducts => 
          prevProducts.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                vote_count: actualData.vote_count,
                user_vote: actualData.user_vote_id ? { id: actualData.user_vote_id } : null
              }
            }
            return product
          })
        )
        
        // Update featured product with actual data
        if (featuredProduct && featuredProduct.id === productId) {
          setFeaturedProduct({
            ...featuredProduct,
            vote_count: actualData.vote_count,
            user_vote: actualData.user_vote_id ? { id: actualData.user_vote_id } : null
          })
        }
      }
    }
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


        {/* Featured Product Rotation */}
        {featuredProduct && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">✨ Featured Product</h3>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Rotates on each visit</span>
              </div>
              <ProductCard 
                key={featuredProduct.id}
                product={featuredProduct}
                rank={0}
                onVoteUpdate={handleVoteUpdate}
                isFeatured={true}
              />
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