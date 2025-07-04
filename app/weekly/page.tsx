'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ProductWithVotes } from '../../types/database'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import CountdownTimer from '../../components/CountdownTimer'
import { Rocket, Trophy, Star } from 'lucide-react'

export default function WeeklyPage() {
  const [products, setProducts] = useState<ProductWithVotes[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [refreshKey])

  const fetchProducts = async () => {
    try {
      // First, get the current active week
      const { data: weekData, error: weekError } = await supabase
        .from('weeks')
        .select('id')
        .eq('active', true)
        .single()

      if (weekError || !weekData) {
        console.error('Error fetching current week:', weekError)
        setLoading(false)
        return
      }

      const currentWeekId = weekData.id
      
      // Fetch all approved products for current week
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('week_id', currentWeekId)
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (productsError) {
        console.error('Error fetching products:', productsError)
        return
      }

      if (!productsData || productsData.length === 0) {
        setProducts([])
        setFeaturedProducts([])
        setLoading(false)
        return
      }

      // Fetch vote counts for each product
      const productsWithVotes = await Promise.all(
        productsData.map(async (product) => {
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)

          return {
            ...product,
            vote_count: count || 0,
            votes: [],
            user_vote: null
          }
        })
      )

      // Sort by vote count (descending) and then by created_at (ascending for tiebreaker)
      const sortedProducts = productsWithVotes.sort((a, b) => {
        if (a.vote_count !== b.vote_count) {
          return b.vote_count - a.vote_count
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })

      // Separate featured products
      const featured = sortedProducts.filter(p => p.featured)
      const regular = sortedProducts.filter(p => !p.featured)

      setFeaturedProducts(featured)
      setProducts(regular)
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteUpdate = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Launch Today, Get a Badge & Community Love 🚀
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The weekly launchpad for indie startups. Submit your product, get votes, and win your place in the spotlight.
          </p>
          
          {/* Countdown Timer */}
          <div className="mb-8">
            <CountdownTimer />
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{product.tagline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white mb-12">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Get Featured</h2>
          </div>
          <p className="mb-4">Premium visibility for your product. Limited spots available.</p>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100">
            Learn More →
          </button>
        </div>

        {/* Launching Now */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Launching Now</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products this week yet!</h3>
              <p className="text-gray-600 mb-4">Be the first to launch your product this week.</p>
              <a
                href="/submit"
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
              >
                Submit Your Product
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={index + 1}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 