'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '@/types/database'
import Image from 'next/image'
import { Calendar, ChevronDown, ChevronUp, Trophy, ExternalLink } from 'lucide-react'

interface WeeklyLaunch {
  weekStart: Date
  weekEnd: Date
  products: ProductWithVotes[]
  winners: ProductWithVotes[]
}

export default function PastLaunchesPage() {
  const [launches, setLaunches] = useState<WeeklyLaunch[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null)

  useEffect(() => {
    loadPastLaunches()
  }, [])

  const loadPastLaunches = async () => {
    const supabase = createClient()
    
    // Get all approved products from the past (excluding current week)
    const today = new Date()
    const currentSunday = new Date(today)
    currentSunday.setDate(today.getDate() - today.getDay())
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        users!created_by (
          first_name,
          last_name,
          handle,
          avatar_url
        )
      `)
      .eq('status', 'approved')
      .lt('created_at', currentSunday.toISOString())
      .order('created_at', { ascending: false })

    if (!error && products) {
      // Get vote counts for each product
      const productsWithVotes = await Promise.all(
        products.map(async (product: any) => {
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)

          return {
            ...product,
            votes: [],
            vote_count: count || 0,
            user_vote: null
          }
        })
      )

      // Group products by week
      const weeklyGroups = new Map<string, ProductWithVotes[]>()
      
      productsWithVotes.forEach(product => {
        const productDate = new Date(product.created_at)
        const weekStart = new Date(productDate)
        weekStart.setDate(productDate.getDate() - productDate.getDay()) // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0)
        
        const weekKey = weekStart.toISOString()
        
        if (!weeklyGroups.has(weekKey)) {
          weeklyGroups.set(weekKey, [])
        }
        weeklyGroups.get(weekKey)!.push(product)
      })

      // Create weekly launch objects
      const weeklyLaunches: WeeklyLaunch[] = Array.from(weeklyGroups.entries()).map(([weekKey, products]) => {
        const weekStart = new Date(weekKey)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        
        // Sort products by votes to get winners
        const sortedProducts = [...products].sort((a, b) => b.vote_count - a.vote_count)
        const winners = sortedProducts.slice(0, 3)
        
        return {
          weekStart,
          weekEnd,
          products: sortedProducts,
          winners
        }
      })

      // Sort weeks by most recent first
      weeklyLaunches.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
      
      setLaunches(weeklyLaunches)
    }
    
    setLoading(false)
  }

  const formatWeekRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = start.toLocaleDateString('en-US', options)
    const endStr = end.toLocaleDateString('en-US', { ...options, year: 'numeric' })
    return `${startStr} - ${endStr}`
  }

  const creatorName = (user: any) => {
    if (!user) return 'Unknown Creator'
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user.handle) {
      return `@${user.handle}`
    }
    return 'Unknown Creator'
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
            Past Launches
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Browse through previous weekly competitions. See what products launched and who took home the prizes.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-16">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#E5E5E5] border-t-[#2D2D2D]"></div>
              <p className="text-sm text-[#666666] mt-4">Loading past launches...</p>
            </div>
          </div>
        ) : launches.length > 0 ? (
          <div className="space-y-4">
            {launches.map((launch, index) => {
              const weekKey = launch.weekStart.toISOString()
              const isExpanded = expandedWeek === weekKey
              
              return (
                <div key={weekKey} className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                  {/* Week Header */}
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : weekKey)}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Calendar className="w-4 h-4" />
                        <span>{formatWeekRange(launch.weekStart, launch.weekEnd)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#999999]">
                          {launch.products.length} products launched
                        </span>
                        {launch.winners.length > 0 && (
                          <span className="text-sm text-[#666666]">
                            • {launch.winners[0].vote_count} votes for winner
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Show winner badges */}
                      {launch.winners.slice(0, 3).map((winner, idx) => (
                        <div key={winner.id} className="flex items-center gap-2">
                          <span className="text-lg">{getRankIcon(idx + 1)}</span>
                          <span className="text-sm font-medium text-[#2D2D2D]">{winner.name}</span>
                        </div>
                      ))}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#666666] ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#666666] ml-2" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#E5E5E5] p-6">
                      <div className="space-y-3">
                        {launch.products.map((product, productIndex) => {
                          const rank = productIndex + 1
                          const isWinner = productIndex < 3
                          
                          return (
                            <div
                              key={product.id}
                              className={`bg-[#FAFAFA] rounded-lg p-4 ${
                                isWinner ? 'ring-2 ring-inset' : ''
                              } ${
                                rank === 1 ? 'ring-[#FFD700]' : 
                                rank === 2 ? 'ring-[#C0C0C0]' : 
                                rank === 3 ? 'ring-[#CD7F32]' : ''
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                {/* Rank */}
                                <div className="flex items-center justify-center w-8 text-sm font-medium text-[#666666]">
                                  {isWinner ? getRankIcon(rank) : `#${rank}`}
                                </div>

                                {/* Logo */}
                                {product.logo_url ? (
                                  <Image
                                    src={product.logo_url}
                                    alt={`${product.name} logo`}
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-[#666666]">
                                    {product.name[0]}
                                  </div>
                                )}

                                {/* Product Info */}
                                <div className="flex-1">
                                  <h4 className="font-medium text-[#2D2D2D] mb-1">{product.name}</h4>
                                  <p className="text-sm text-[#666666] mb-1">{product.tagline}</p>
                                  <div className="flex items-center gap-3 text-xs text-[#999999]">
                                    <span>by {creatorName(product.users)}</span>
                                    {product.categories && product.categories.length > 0 && (
                                      <span>• {product.categories[0]}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Vote Count & Link */}
                                <div className="flex items-center gap-3">
                                  <div className="text-center">
                                    <div className="text-lg font-semibold text-[#2D2D2D]">{product.vote_count}</div>
                                    <div className="text-xs text-[#666666]">votes</div>
                                  </div>
                                  <a
                                    href={product.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white rounded-lg hover:bg-[#F5F5F5] transition-colors group"
                                    title="Visit website"
                                  >
                                    <ExternalLink className="w-4 h-4 text-[#666666] group-hover:text-[#2D2D2D]" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-16 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">No past launches yet</h3>
            <p className="text-[#666666] mb-6">
              Check back after the first weekly competition ends!
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              View Current Competition
            </a>
          </div>
        )}

        {/* Bottom CTA */}
        {launches.length > 0 && (
          <div className="mt-16 text-center py-8 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#666666] mb-4">
              Ready to launch your product?
            </p>
            <a 
              href="/submit"
              className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
            >
              Submit Your Product
            </a>
          </div>
        )}
      </main>
    </div>
  )
}