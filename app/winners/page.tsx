'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '@/types/database'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Download, Calendar, ExternalLink } from 'lucide-react'
import { generateWinnerBadge } from '@/utils/generateWinnerBadge'

export default function WinnersPage() {
  const [winners, setWinners] = useState<ProductWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [lastWeekDates, setLastWeekDates] = useState({ start: '', end: '' })

  useEffect(() => {
    loadLastWeekWinners()
  }, [])

  const loadLastWeekWinners = async () => {
    const supabase = createClient()
    
    // Get last week's date range
    const today = new Date()
    const lastSunday = new Date(today)
    lastSunday.setDate(today.getDate() - today.getDay() - 1) // Last Sunday
    const lastMonday = new Date(lastSunday)
    lastMonday.setDate(lastSunday.getDate() - 6) // Last Monday

    setLastWeekDates({
      start: lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: lastSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })

    // Get top 3 products from last week
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
      .gte('created_at', lastMonday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(20) // Get more to ensure we have enough after vote counting

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

      // Sort by votes and get top 3
      productsWithVotes.sort((a, b) => b.vote_count - a.vote_count)
      setWinners(productsWithVotes.slice(0, 3))
    }
    
    setLoading(false)
  }

  const getRankDetails = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: '🥇',
          title: 'Gold Winner',
          color: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-400',
          badgeColor: 'bg-gradient-to-r from-yellow-400 to-amber-500'
        }
      case 2:
        return {
          icon: '🥈',
          title: 'Silver Winner',
          color: 'from-gray-50 to-slate-50',
          borderColor: 'border-gray-400',
          badgeColor: 'bg-gradient-to-r from-gray-400 to-slate-500'
        }
      case 3:
        return {
          icon: '🥉',
          title: 'Bronze Winner',
          color: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-400',
          badgeColor: 'bg-gradient-to-r from-orange-400 to-amber-600'
        }
      default:
        return null
    }
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

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
            Latest Winners
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Top products from last week's competition. These makers earned the most votes from our community.
          </p>
        </div>

        {/* Week Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-[#666666] border border-[#E5E5E5]">
            <Calendar className="w-4 h-4" />
            <span>{lastWeekDates.start} - {lastWeekDates.end}</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-16">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#E5E5E5] border-t-[#2D2D2D]"></div>
              <p className="text-sm text-[#666666] mt-4">Loading winners...</p>
            </div>
          </div>
        ) : winners.length > 0 ? (
          <div className="space-y-3">
            {winners.map((product, index) => {
              const rank = index + 1
              const rankDetails = getRankDetails(rank)
              
              if (!rankDetails) return null

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl border transition-all ${
                    rank === 1 ? 'border-[#FFD700] border-2' : 
                    rank === 2 ? 'border-[#C0C0C0] border-2' : 
                    rank === 3 ? 'border-[#CD7F32] border-2' : 
                    'border-[#E5E5E5]'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Left: Rank + Logo */}
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-8">
                          <span className="text-lg font-bold">
                            {rankDetails.icon}
                          </span>
                        </div>

                        {/* Logo */}
                        {product.logo_url ? (
                          <Image
                            src={product.logo_url}
                            alt={`${product.name} logo`}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-lg font-bold text-[#666666]">
                            {product.name[0]}
                          </div>
                        )}
                      </div>

                      {/* Middle: Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-[#2D2D2D] mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-[#666666] mb-2">{product.tagline}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-[#999999]">
                                by {creatorName(product.users)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Vote Count + Actions */}
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#2D2D2D]">
                            {product.vote_count}
                          </div>
                          <div className="text-xs text-[#666666]">votes</div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={product.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors group"
                            title="Visit website"
                          >
                            <ExternalLink className="w-4 h-4 text-[#666666] group-hover:text-[#2D2D2D]" />
                          </a>
                          
                          <button
                            onClick={async () => {
                              const badgeDataUrl = await generateWinnerBadge(
                                product.name,
                                rank,
                                `${lastWeekDates.start} - ${lastWeekDates.end}`
                              )
                              
                              const link = document.createElement('a')
                              link.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}-winner-badge.png`
                              link.href = badgeDataUrl
                              link.click()
                            }}
                            className="p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors group"
                            title="Download winner badge"
                          >
                            <Download className="w-4 h-4 text-[#666666] group-hover:text-[#2D2D2D]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-16 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">No winners yet</h3>
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
        {winners.length > 0 && (
          <div className="mt-16 text-center py-8 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#666666] mb-4">
              Want to be next week's winner?
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