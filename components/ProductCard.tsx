'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { ProductWithVotes } from '../types/database'
import { Heart, MessageCircle, ExternalLink, Play } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductCardProps {
  product: ProductWithVotes
  rank: number
  onVoteUpdate: () => void
}

export default function ProductCard({ product, rank, onVoteUpdate }: ProductCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const { user } = useAuth()

  const handleVote = async () => {
    if (!user) {
      toast.error('Please sign in to vote')
      return
    }

    setIsVoting(true)
    
    try {
      const { error } = await supabase
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
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  const getRankBadge = () => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getRankText = () => {
    if (rank === 1) return '1st Place'
    if (rank === 2) return '2nd Place'
    if (rank === 3) return '3rd Place'
    return `${rank}th Place`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        {/* Rank Badge */}
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRankBadge()}`}>
          {getRankText()}
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Featured
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start space-x-4">
        {/* Product Logo */}
        <div className="flex-shrink-0">
          {product.logo_url ? (
            <Image
              src={product.logo_url}
              alt={`${product.name} logo`}
              width={64}
              height={64}
              className="rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Logo</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>by</span>
              <span className="font-medium">@{product.created_by}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {product.tagline}
          </p>
          
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Vote Button */}
          <button
            onClick={handleVote}
            disabled={isVoting || product.user_vote !== null}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              product.user_vote
                ? 'bg-red-50 text-red-700 border border-red-200 cursor-not-allowed'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${product.user_vote ? 'fill-current' : ''}`} />
            <span>{product.vote_count}</span>
          </button>

          {/* Comments */}
          <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100">
            <MessageCircle className="h-4 w-4" />
            <span>0</span>
          </button>

          {/* External Link */}
          <a
            href={product.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Video Link */}
          {product.video_url && (
            <a
              href={product.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            >
              <Play className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 