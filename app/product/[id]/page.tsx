'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { ProductWithVotes, CommentWithUser } from '../../../types/database'
import Header from '../../../components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink, MessageCircle, Send, Tag, ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLoginModal } from '@/contexts/LoginModalContext'
import MarkdownRenderer from '../../../components/MarkdownRenderer'

// Function to convert video URLs to embed URLs
function getEmbedUrl(url: string): string {
  if (!url) return ''
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`
  }
  
  // Return original URL if no match
  return url
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { user } = useAuth()
  const { openLoginModal } = useLoginModal()
  
  const [product, setProduct] = useState<ProductWithVotes | null>(null)
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadProductAndComments()
  }, [productId, user])

  const loadProductAndComments = async () => {
    try {
      // Load product details
      const { data: productData, error: productError } = await createClient()
        .from('products')
        .select(`
          *,
          users!created_by (
            first_name,
            last_name,
            handle
          )
        `)
        .eq('id', productId)
        .single()

      if (productError || !productData) {
        console.error('Error loading product:', productError)
        return
      }

      // Increment view count
      await createClient().rpc('increment_product_views', { p_product_id: productId })

      // Get vote count
      const { count: voteCount } = await createClient()
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId)

      // Check if user has voted
      let userVote = null
      if (user) {
        const { data: voteData, error: voteError } = await createClient()
          .from('votes')
          .select('*')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (!voteError && voteData) {
          userVote = voteData
        }
      }

      setProduct({
        ...productData,
        votes: [],
        vote_count: voteCount || 0,
        user_vote: userVote
      })

      // Load comments
      const { data: commentsData, error: commentsError } = await createClient()
        .from('comments')
        .select(`
          *,
          users (
            first_name,
            last_name,
            handle,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: true })

      if (!commentsError) {
        setComments(commentsData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!user) {
      toast.error('Please sign in to vote')
      openLoginModal(`/product/${productId}`)
      return
    }

    if (!product) return

    setIsVoting(true)
    
    try {
      if (product.user_vote) {
        // Unvote
        const { error } = await createClient()
          .from('votes')
          .delete()
          .eq('id', product.user_vote.id)

        if (error) {
          toast.error('Error removing vote')
        } else {
          toast.success('Vote removed!')
          loadProductAndComments()
        }
      } else {
        // Vote
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
          toast.error('Error voting')
        } else {
          toast.success('Vote recorded!')
          loadProductAndComments()
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsVoting(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to comment')
      openLoginModal(`/product/${productId}`)
      return
    }

    if (!newComment.trim() || !product) return

    setSubmittingComment(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          productId: product.id,
          weekId: product.week_id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment')
      }

      toast.success('Comment posted!')
      setNewComment('')
      loadProductAndComments()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await createClient()
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

      if (error) {
        toast.error('Error deleting comment')
      } else {
        toast.success('Comment deleted')
        loadProductAndComments()
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const commentDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return commentDate.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-4">Product not found</h1>
          <Link href="/" className="text-[#666666] hover:text-[#2D2D2D]">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  const creatorName = product.users?.handle 
    ? `@${product.users.handle}` 
    : product.users?.first_name && product.users?.last_name
    ? `${product.users.first_name} ${product.users.last_name}`
    : 'Unknown Creator'

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#2D2D2D] mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to launches
        </Link>

        {/* Product Header */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              {product.logo_url ? (
                <Image
                  src={product.logo_url}
                  alt={`${product.name} logo`}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#E5E5E5]"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-[#666666]">
                  {product.name.charAt(0)}
                </div>
              )}</div>
            
            <div className="flex-1 w-full">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#2D2D2D] mb-2">{product.name}</h1>
              <p className="text-sm sm:text-base text-[#666666] mb-3">{product.tagline}</p>
              
              <div className="flex items-center gap-4 text-xs sm:text-sm mb-3">
                <span className="text-[#999999]">by {creatorName}</span>
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#666666]"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={handleVote}
                  disabled={isVoting}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    product.user_vote
                      ? 'bg-orange-50 text-orange-600 border border-orange-300 sm:hover:border-orange-400'
                      : 'bg-white text-[#666666] border border-[#E5E5E5] sm:hover:border-orange-300 sm:hover:text-orange-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${product.user_vote ? 'fill-orange-600' : ''}`} />
                  <span>{product.user_vote ? 'Unvote' : 'Vote'}</span>
                  <span className="text-sm">({isVoting ? '...' : product.vote_count})</span>
                </button>

                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D2D2D] text-white rounded-lg sm:hover:bg-[#1D1D1D] transition-colors font-medium text-sm sm:text-base"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {product.featured_image_url && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8 mb-6 sm:mb-8">
            <Image
              src={product.featured_image_url}
              alt={`${product.name} screenshot`}
              width={1200}
              height={675}
              className="w-full rounded-lg border border-[#E5E5E5]"
            />
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4">About</h2>
            <div className="text-sm sm:text-base">
              <MarkdownRenderer content={product.description} />
            </div>
          </div>
        )}

        {/* Screenshots */}
        {product.screenshot_urls && product.screenshot_urls.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.screenshot_urls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${product.name} screenshot ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full rounded-lg border border-[#E5E5E5] cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {product.video_url && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4">Demo Video</h2>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getEmbedUrl(product.video_url)}
                title={`${product.name} demo video`}
                className="absolute inset-0 w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-8">
          <h2 className="text-base sm:text-lg font-semibold text-[#2D2D2D] mb-4 sm:mb-6 flex items-center">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Comments ({comments.length})
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const commenterName = comment.users?.handle 
                  ? `@${comment.users.handle}` 
                  : comment.users?.first_name && comment.users?.last_name
                  ? `${comment.users.first_name} ${comment.users.last_name}`
                  : 'Anonymous'

                return (
                  <div key={comment.id} className="group flex gap-3 p-3 rounded-lg hover:bg-[#FDFCFA] transition-colors">
                    {comment.users?.avatar_url ? (
                      <Image
                        src={comment.users.avatar_url}
                        alt={commenterName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                        <span className="text-[#666666] font-medium">
                          {commenterName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#2D2D2D]">{commenterName}</span>
                          <span className="text-xs text-[#999999]">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        {user && comment.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                            title="Delete comment"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                      <p className="text-[#666666]">{comment.content}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#999999]" />
                </div>
                <p className="text-[#999999] mb-2">No comments yet</p>
                <p className="text-sm text-[#666666]">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-4 py-2.5 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1D1D1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                <span>{submittingComment ? 'Posting...' : 'Post'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-4 bg-[#F5F5F5] rounded-lg">
              <p className="text-[#666666]">
                Please <button onClick={() => openLoginModal(`/product/${productId}`)} className="text-orange-600 hover:text-orange-700">sign in</button> to comment
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}