'use client'

import Header from '@/components/Header'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '@/types/database'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApprovedProducts()
  }, [])

  const loadApprovedProducts = async () => {
    const supabase = createClient()
    
    // Get current week
    const { data: currentWeek } = await supabase
      .from('weeks')
      .select('id')
      .eq('active', true)
      .single()

    if (currentWeek) {
      // Get approved products for current week with vote counts
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          votes(count)
        `)
        .eq('week_id', currentWeek.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error && products) {
        // Transform data to match ProductWithVotes interface
        const productsWithVotes = products.map((product: any) => ({
          ...product,
          votes: [],
          vote_count: product.votes?.[0]?.count || 0,
          user_vote: null
        }))
        setProducts(productsWithVotes)
      }
    }
    setLoading(false)
  }

  const handleVoteUpdate = () => {
    loadApprovedProducts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Launch Today, Get a Badge & Community Love 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The weekly launchpad for indie startups. Submit your product, get votes, and win your place in the spotlight.
          </p>
        </div>

        <CountdownTimer />

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Get Featured</h2>
            <p className="text-lg mb-6">Premium visibility for your product. Limited spots available.</p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn More →
            </button>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Launching Now</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
                     ) : products.length > 0 ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {products.map((product, index) => (
                 <ProductCard 
                   key={product.id} 
                   product={product} 
                   rank={index + 1}
                   onVoteUpdate={handleVoteUpdate}
                 />
               ))}
             </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl text-gray-300 mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products this week yet!</h3>
              <p className="text-gray-600 mb-6">Be the first to launch your product this week.</p>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Submit Your Product
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
} 