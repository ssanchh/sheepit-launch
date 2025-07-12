'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Download, Copy, Check, Trophy, Medal, Award, Star, Lock } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface Badge {
  id: string
  name: string
  description: string
  imageUrl: string
  available: boolean
  criteria?: string
  embedCode?: string
}

interface UserBadge {
  badge_id: string
  awarded_date: string
  week_id?: string
  position?: number
}

export default function BadgesSection({ userId }: { userId: string }) {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null)

  // Define all possible badges
  const allBadges: Badge[] = [
    {
      id: 'week-winner-1',
      name: '#1 Product of the Week',
      description: 'Your product ranked #1 in the weekly launch',
      imageUrl: '/badges/sheep-it-winner-1.png', // You'll create this in Figma
      available: false,
      criteria: 'Achieve the most votes in a weekly launch'
    },
    {
      id: 'week-winner-2',
      name: '#2 Product of the Week',
      description: 'Your product ranked #2 in the weekly launch',
      imageUrl: '/badges/sheep-it-winner-2.png',
      available: false,
      criteria: 'Achieve the second most votes in a weekly launch'
    },
    {
      id: 'week-winner-3',
      name: '#3 Product of the Week',
      description: 'Your product ranked #3 in the weekly launch',
      imageUrl: '/badges/sheep-it-winner-3.png',
      available: false,
      criteria: 'Achieve the third most votes in a weekly launch'
    },
    {
      id: 'featured',
      name: 'Featured Product',
      description: 'Your product was featured on Sheep It',
      imageUrl: '/badges/sheep-it-featured.png',
      available: false,
      criteria: 'Get the featured spot for your product'
    },
    {
      id: 'launched',
      name: 'Launched on Sheep It',
      description: 'Successfully launched a product on Sheep It',
      imageUrl: '/badges/sheep-it-launched.png',
      available: false,
      criteria: 'Launch at least one product'
    },
    {
      id: 'maker',
      name: 'Sheep It Maker',
      description: 'Part of the Sheep It community',
      imageUrl: '/badges/sheep-it-maker.png',
      available: true,
      criteria: 'Join the Sheep It community'
    }
  ]

  useEffect(() => {
    loadUserBadges()
  }, [userId])

  const loadUserBadges = async () => {
    try {
      // In the future, this will load from a user_badges table
      // For now, we'll check their products and wins
      const supabase = createClient()
      
      // Check if user has launched products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('created_by', userId)
        .eq('is_live', true)
        .limit(1)
      
      const badges: UserBadge[] = []
      
      // Always give maker badge
      badges.push({
        badge_id: 'maker',
        awarded_date: new Date().toISOString()
      })
      
      // Check if they've launched
      if (products && products.length > 0) {
        badges.push({
          badge_id: 'launched',
          awarded_date: new Date().toISOString()
        })
      }
      
      // Check for wins (will work after first launch)
      const { data: wins } = await supabase
        .from('winners')
        .select('position, week_id, created_at')
        .eq('product_id', products?.[0]?.id || '')
      
      if (wins) {
        wins.forEach(win => {
          badges.push({
            badge_id: `week-winner-${win.position}`,
            awarded_date: win.created_at,
            week_id: win.week_id,
            position: win.position
          })
        })
      }
      
      setUserBadges(badges)
    } catch (error) {
      console.error('Error loading badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeEmbedCode = (badge: Badge) => {
    return `<a href="https://sheepit.io" target="_blank" rel="noopener">
  <img src="https://sheepit.io${badge.imageUrl}" alt="${badge.name}" width="200" height="73" />
</a>`
  }

  const copyEmbedCode = (badge: Badge) => {
    navigator.clipboard.writeText(getBadgeEmbedCode(badge))
    setCopiedBadgeId(badge.id)
    toast.success('Embed code copied!')
    setTimeout(() => setCopiedBadgeId(null), 2000)
  }

  const downloadBadge = async (badge: Badge) => {
    try {
      const response = await fetch(badge.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${badge.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Badge downloaded!')
    } catch (error) {
      toast.error('Failed to download badge')
    }
  }

  const userHasBadge = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D2D2D]">Your Badges</h1>
        <p className="text-[#666666] mt-2">
          Display your achievements on your website or social media
        </p>
      </div>

      {/* Earned Badges */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6">Earned Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges
            .filter(badge => userHasBadge(badge.id))
            .map(badge => (
              <div key={badge.id} className="bg-white rounded-xl border-4 border-[#E5E5E5] hover:border-orange-400 transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
                      {badge.name}
                      {badge.id.includes('winner-1') && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {badge.id.includes('winner-2') && <Medal className="w-5 h-5 text-gray-400" />}
                      {badge.id.includes('winner-3') && <Award className="w-5 h-5 text-orange-600" />}
                    </h3>
                    <p className="text-sm text-[#666666] mt-1">{badge.description}</p>
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="mb-4 flex items-center justify-center">
                  <Image
                    src={badge.imageUrl}
                    alt={badge.name}
                    width={300}
                    height={110}
                    className="block"
                    quality={100}
                    unoptimized={true}
                    style={{ imageRendering: 'crisp-edges' }}
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<div class="bg-[#2D2D2D] text-white text-xs px-3 py-2 rounded">Badge #${badge.id}</div>`
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadBadge(badge)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1D1D1D] transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => copyEmbedCode(badge)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E5E5] text-[#2D2D2D] rounded-lg hover:bg-[#F5F5F5] transition-colors text-sm font-medium"
                  >
                    {copiedBadgeId === badge.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedBadgeId === badge.id ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                {/* Embed Code */}
                <details className="mt-4">
                  <summary className="text-xs text-[#666666] cursor-pointer hover:text-[#2D2D2D]">
                    View embed code
                  </summary>
                  <div className="mt-2 bg-[#F5F5F5] rounded-lg p-3 font-mono text-xs overflow-x-auto">
                    <code>{getBadgeEmbedCode(badge)}</code>
                  </div>
                </details>
              </div>
            ))}
        </div>

        {userBadges.length === 1 && userBadges[0].badge_id === 'maker' && (
          <div className="mt-6 text-center py-8">
            <p className="text-[#666666]">
              Launch your first product to earn more badges! 🚀
            </p>
          </div>
        )}
      </div>

      {/* Available Badges */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6">Available Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges
            .filter(badge => !userHasBadge(badge.id) && badge.id !== 'maker')
            .map(badge => (
              <div key={badge.id} className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
                    {badge.name}
                    <Lock className="w-4 h-4 text-[#999999]" />
                  </h3>
                  <p className="text-sm text-[#666666] mt-1">{badge.description}</p>
                </div>

                {/* Badge Preview */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src={badge.imageUrl}
                      alt={badge.name}
                      width={300}
                      height={110}
                      className="block opacity-40"
                      quality={100}
                      unoptimized={true}
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-[#666666]" />
                    </div>
                  </div>
                </div>

                {/* How to earn */}
                <div className="text-xs text-[#666666] italic">
                  {badge.criteria}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-orange-50 rounded-xl p-6 border border-orange-200">
        <h3 className="text-lg font-semibold text-[#2D2D2D] mb-3">How to use badges</h3>
        <ol className="space-y-2 text-sm text-[#666666]">
          <li>1. Download the badge image or copy the embed code</li>
          <li>2. Add it to your website, blog, or social media profiles</li>
          <li>3. Link back to Sheep It to help others discover the community</li>
          <li>4. Earn more badges by launching products and winning weekly competitions</li>
        </ol>
      </div>
    </div>
  )
}