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

const getExampleProducts = (): ProductWithVotes[] => {
  const exampleProducts = [
    {
      id: 'example-1',
      name: 'Duolingo',
      tagline: 'Language learning made fun',
      description: 'Learn a new language with the world\'s most-downloaded education app',
      logo_url: 'https://logo.clearbit.com/duolingo.com',
      website_url: 'https://duolingo.com',
      vote_count: 452,
      comment_count: 23,
    },
    {
      id: 'example-2',
      name: 'Grammarly',
      tagline: 'AI-powered writing assistant',
      description: 'Compose bold, clear, mistake-free writing with Grammarly\'s AI-powered writing assistant',
      logo_url: 'https://logo.clearbit.com/grammarly.com',
      website_url: 'https://grammarly.com',
      vote_count: 398,
      comment_count: 18,
    },
    {
      id: 'example-3',
      name: 'Notion',
      tagline: 'Your all-in-one workspace',
      description: 'Write, plan, collaborate, and get organized. Notion is all you need — in one tool',
      logo_url: 'https://logo.clearbit.com/notion.so',
      website_url: 'https://notion.so',
      vote_count: 367,
      comment_count: 21,
    },
    {
      id: 'example-4',
      name: 'Linear',
      tagline: 'Streamline software projects',
      description: 'Linear is a better way to build products. Meet the new standard for modern software development',
      logo_url: 'https://logo.clearbit.com/linear.app',
      website_url: 'https://linear.app',
      vote_count: 312,
      comment_count: 15,
    },
    {
      id: 'example-5',
      name: 'Figma',
      tagline: 'Collaborative design tool',
      description: 'Build better products as a team. Design, prototype, and gather feedback all in one place',
      logo_url: 'https://logo.clearbit.com/figma.com',
      website_url: 'https://figma.com',
      vote_count: 289,
      comment_count: 19,
    },
    {
      id: 'example-6',
      name: 'Stripe',
      tagline: 'Payments infrastructure for the internet',
      description: 'Millions of businesses use Stripe to accept payments and manage their businesses online',
      logo_url: 'https://logo.clearbit.com/stripe.com',
      website_url: 'https://stripe.com',
      vote_count: 256,
      comment_count: 12,
    },
    {
      id: 'example-7',
      name: 'Vercel',
      tagline: 'Deploy frontend apps in seconds',
      description: 'Vercel is the platform for frontend developers, providing the speed and reliability to create at the moment of inspiration',
      logo_url: 'https://logo.clearbit.com/vercel.com',
      website_url: 'https://vercel.com',
      vote_count: 223,
      comment_count: 14,
    },
    {
      id: 'example-8',
      name: 'Spotify',
      tagline: 'Music for everyone',
      description: 'With Spotify, it\'s easy to find the right music or podcast for every moment – on your phone, computer, tablet and more',
      logo_url: 'https://logo.clearbit.com/spotify.com',
      website_url: 'https://spotify.com',
      vote_count: 198,
      comment_count: 16,
    },
    {
      id: 'example-9',
      name: 'Slack',
      tagline: 'Where work happens',
      description: 'Slack is a new way to communicate with your team. It\'s faster, better organized, and more secure than email',
      logo_url: 'https://logo.clearbit.com/slack.com',
      website_url: 'https://slack.com',
      vote_count: 176,
      comment_count: 11,
    },
    {
      id: 'example-10',
      name: 'GitHub',
      tagline: 'Where the world builds software',
      description: 'GitHub is where over 100 million developers shape the future of software, together',
      logo_url: 'https://logo.clearbit.com/github.com',
      website_url: 'https://github.com',
      vote_count: 154,
      comment_count: 13,
    },
  ]

  // Add required fields to match ProductWithVotes type
  return exampleProducts.map(product => ({
    ...product,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'example-user',
    status: 'approved',
    week_id: 'example-week',
    launch_date: new Date().toISOString(),
    is_live: true,
    queue_position: 0,
    images: null,
    users: {
      first_name: 'Example',
      last_name: 'Maker',
      handle: 'examplemaker'
    },
    votes: [],
    user_vote: null,
    is_example: true // Flag to identify example products
  } as ProductWithVotes & { is_example: boolean }))
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithVotes[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredProduct, setFeaturedProduct] = useState<ProductWithVotes | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUser()
    loadApprovedProducts()
    loadFeaturedProduct()
  }, [])

  const loadUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

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
    } else {
      // If no real products, show example products until August 4th
      const launchDate = new Date('2024-08-04')
      const now = new Date()
      
      if (now < launchDate) {
        const examples = getExampleProducts()
        setProducts(examples)
        setFilteredProducts(examples)
      } else {
        setProducts([])
        setFilteredProducts([])
      }
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
            user_vote: isVoting ? { 
              id: 'temp-id',
              user_id: user?.id || '',
              product_id: productId,
              week_id: product.week_id,
              created_at: new Date().toISOString()
            } : null
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
            user_vote: isVoting ? { 
              id: 'temp-id',
              user_id: user?.id || '',
              product_id: productId,
              week_id: product.week_id,
              created_at: new Date().toISOString()
            } : null
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
        user_vote: isVoting ? { 
          id: 'temp-id',
          user_id: user?.id || '',
          product_id: productId,
          week_id: featuredProduct.week_id,
          created_at: new Date().toISOString()
        } : null
      })
    }
    
    // Then fetch the actual updated data for that specific product
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (currentUser) {
      const { data: voteData } = await supabase
        .rpc('get_product_vote_data', { 
          product_id_param: productId, 
          user_id_param: currentUser.id 
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
                user_vote: actualData.user_vote_id ? product.user_vote : null
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
                user_vote: actualData.user_vote_id ? product.user_vote : null
              }
            }
            return product
          })
        )
        
        // Update featured product with actual data
        if (featuredProduct && featuredProduct.id === productId) {
          setFeaturedProduct(prev => prev ? {
            ...prev,
            vote_count: actualData.vote_count,
            user_vote: actualData.user_vote_id ? prev.user_vote : null
          } : null)
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

        {/* Stats Bar - Show when we have products (including examples) */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#2D2D2D]">{products.length}</div>
                  <div className="text-xs sm:text-sm text-[#666666]">
                    {products[0]?.is_example ? 'Example products' : 'Launching this week'}
                  </div>
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
              {searchQuery ? `Search results for "${searchQuery}"` : products[0]?.is_example ? "See how your product could look" : "This week's launches"}
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              {searchQuery ? `Found ${filteredProducts.length} products` : products[0]?.is_example ? "These are example products • Real launches begin August 4th" : "Vote for your favorites • Top 3 win prizes"}
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
          ) : searchQuery ? (
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 sm:p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2D2D] mb-2">
                No products found
              </h3>
              <p className="text-sm sm:text-base text-[#666666]">
                No products match "{searchQuery}". Try a different search term.
              </p>
            </div>
          ) : null}
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