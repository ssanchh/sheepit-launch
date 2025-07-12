'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes } from '../types/database'
import { Heart, ExternalLink, MessageCircle, Crown } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: ProductWithVotes
  rank: number
  onVoteUpdate: () => void
  totalProducts?: number
  leadingVotes?: number
  isTop3?: boolean
  isFeatured?: boolean
}

export default function ProductCard({ product, rank, onVoteUpdate, totalProducts = 0, leadingVotes = 0, isTop3 = false, isFeatured = false }: ProductCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please sign in to vote')
      return
    }

    setIsVoting(true)
    
    try {
      // Check if user has already voted
      if (product.user_vote) {
        // Unvote - remove the vote
        const { error } = await createClient()
          .from('votes')
          .delete()
          .eq('id', product.user_vote.id)

        if (error) {
          toast.error('Error removing vote. Please try again.')
        } else {
          toast.success('Vote removed!')
          onVoteUpdate()
        }
      } else {
        // Vote - add new vote
        const { error } = await createClient()
          .from('votes')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              week_id: product.week_id,
            },
          ])

        if (error) {
          if (error.code === '23505') {
            toast.error('You\'ve already voted for this product')
          } else {
            toast.error('Error voting. Please try again.')
          }
        } else {
          toast.success('Vote recorded!')
          onVoteUpdate()
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  const getRankBadge = () => {
    if (rank === 1) return { text: '1st Place', color: '#FFD700' }
    if (rank === 2) return { text: '2nd Place', color: '#C0C0C0' }
    if (rank === 3) return { text: '3rd Place', color: '#CD7F32' }
    return null
  }

  const rankBadge = getRankBadge()

  const handleProductClick = () => {
    router.push(`/product/${product.id}`)
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  return (
    <div 
      className={`relative bg-white rounded-xl border-4 transition-all cursor-pointer group ${
        isFeatured ? 'border-orange-300 shadow-md' : 'border-[#E5E5E5] hover:border-orange-400'
      }`}
      onClick={handleProductClick}
    >
      {/* Rank Badge */}
      {rankBadge && !isFeatured && (
        <div 
          className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-[#2D2D2D] text-white rounded-full text-xs font-medium"
        >
          {rankBadge.text}
        </div>
      )}
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Left: Rank + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Rank Number */}
            {!isFeatured && (
              <div className="flex items-center justify-center w-6 sm:w-8">
                <span className="text-xs sm:text-sm font-medium text-[#666666]">
                  {rank}
                </span>
              </div>
            )}

            {/* Logo */}
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={`${product.name} logo`}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-[#E5E5E5]"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center border border-[#E5E5E5]">
                <span className="text-[#666666] font-medium text-sm">{product.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Middle: Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2D2D2D] group-hover:text-orange-600 transition-colors truncate">
                    {product.name}
                  </h3>
                  {(product as any).is_featured_paid && (
                    <span className="hidden sm:flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      <Crown className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#999999] hover:text-orange-600 transition-colors" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-[#666666] mt-0.5 sm:mt-1 line-clamp-1">
                  {product.tagline}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-4">
                {/* Vote Button */}
                <button
                  onClick={handleVote}
                  disabled={isVoting}
                  className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-xs sm:text-sm font-medium border-2 transition-all ${
                    product.user_vote
                      ? 'bg-orange-50 text-orange-600 border-orange-300 hover:border-orange-400'
                      : 'bg-white text-[#666666] border-[#E5E5E5] hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${product.user_vote ? 'fill-orange-600' : ''}`}
                  />
                  <span className="text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1">
                    {isVoting ? '...' : product.vote_count}
                  </span>
                </button>

                {/* Comments */}
                <button
                  onClick={handleCommentClick}
                  className="flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-xs sm:text-sm font-medium bg-white text-[#666666] border-2 border-[#E5E5E5] hover:border-orange-300 hover:text-orange-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1">{product.comment_count || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}