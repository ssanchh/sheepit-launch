'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Check, X, Clock, ExternalLink, MessageSquare, ArrowUp, ArrowDown, Calendar, Users, Activity, Eye, Play, Square } from 'lucide-react'
import Header from '@/components/Header'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  website_url: string
  logo_url: string
  video_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  created_by: string
  admin_notes: string
  queue_position?: number
  launch_week_id?: string
  is_live?: boolean
  vote_count?: number
  users: {
    first_name: string
    last_name: string
    handle: string
    email: string
  }
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'queue' | 'live'>('analytics')
  const [queueProducts, setQueueProducts] = useState<Product[]>([])
  const [liveProducts, setLiveProducts] = useState<Product[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'analytics') {
        loadAnalytics()
      } else if (activeTab === 'approvals') {
        loadProducts()
      } else if (activeTab === 'queue') {
        loadQueueProducts()
      } else if (activeTab === 'live') {
        loadLiveProducts()
      }
    }
  }, [isAdmin, selectedStatus, activeTab])

  const checkAdminStatus = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user?.id)
      .single()

    if (data?.is_admin) {
      setIsAdmin(true)
    } else {
      router.push('/')
    }
  }

  const loadProducts = async () => {
    const supabase = createClient()
    
    let query = supabase
      .from('products')
      .select(`
        *,
        users!created_by (
          first_name,
          last_name,
          handle,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } else {
      setProducts(data || [])
    }
    setLoadingProducts(false)
  }

  const loadQueueProducts = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users!created_by (
          first_name,
          last_name,
          handle,
          email
        )
      `)
      .eq('status', 'approved')
      .not('queue_position', 'is', null)
      .is('launch_week_id', null)
      .order('queue_position', { ascending: true })

    if (error) {
      console.error('Error loading queue:', error)
      toast.error('Failed to load queue')
    } else {
      setQueueProducts(data || [])
    }
    setLoadingProducts(false)
  }

  const loadLiveProducts = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users!created_by (
          first_name,
          last_name,
          handle,
          email
        )
      `)
      .eq('status', 'approved')
      .eq('is_live', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading live products:', error)
      toast.error('Failed to load live products')
    } else {
      // Get vote counts for each product
      const productsWithVotes = await Promise.all(
        (data || []).map(async (product) => {
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)
          
          return { ...product, vote_count: count || 0 }
        })
      )
      
      // Sort by vote count
      productsWithVotes.sort((a, b) => b.vote_count - a.vote_count)
      setLiveProducts(productsWithVotes)
    }
    setLoadingProducts(false)
  }

  const loadAnalytics = async () => {
    const supabase = createClient()
    
    // Get overall stats
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { count: totalVotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
    
    const { count: pendingProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    
    setAnalytics({
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalVotes: totalVotes || 0,
      pendingProducts: pendingProducts || 0
    })
    setLoadingProducts(false)
  }

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected', notes?: string) => {
    const supabase = createClient()
    
    // Get product details for email
    const product = products.find(p => p.id === productId)
    if (!product) return

    const { error } = await supabase
      .from('products')
      .update({
        status,
        admin_notes: notes || '',
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        approved_by: user?.id
      })
      .eq('id', productId)

    if (error) {
      toast.error('Failed to update product status')
    } else {
      let queuePosition: number | undefined
      
      // If approved, add to queue
      if (status === 'approved') {
        const { error: queueError, data: queueData } = await supabase.rpc('add_to_queue', { 
          product_uuid: productId 
        })
        
        if (queueError) {
          console.error('Error adding to queue:', queueError)
          toast.error('Product approved but failed to add to queue')
        } else {
          queuePosition = queueData
          toast.success('Product approved and added to queue!')
        }
      } else {
        toast.success(`Product ${status}!`)
      }
      
      // Send email notification
      try {
        const response = await fetch('/api/admin/product-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            productName: product.name,
            status,
            userEmail: product.users.email,
            userId: product.created_by,
            queuePosition,
            adminNotes: notes
          })
        })
        
        if (!response.ok) {
          console.error('Failed to send notification email')
        }
      } catch (error) {
        console.error('Error sending notification:', error)
      }
      
      // Refresh all data
      loadProducts()
      loadQueueProducts()
      loadLiveProducts()
    }
  }

  const moveInQueue = async (productId: string, direction: 'up' | 'down') => {
    const supabase = createClient()
    const product = queueProducts.find(p => p.id === productId)
    if (!product || !product.queue_position) return

    const newPosition = direction === 'up' 
      ? product.queue_position - 1 
      : product.queue_position + 1

    if (newPosition < 1) return

    const { error } = await supabase.rpc('reorder_queue', {
      product_uuid: productId,
      new_position: newPosition
    })

    if (error) {
      toast.error('Failed to reorder queue')
      console.error('Queue reorder error:', error)
    } else {
      toast.success('Queue updated!')
      loadQueueProducts()
    }
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#F5F5F5] text-[#2D2D2D] border border-[#E5E5E5]'
      case 'rejected':
        return 'bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]'
      default:
        return 'bg-[#2D2D2D] text-white'
    }
  }

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D] mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Admin Dashboard</h1>
          <p className="text-[#666666]">Manage products, monitor analytics, and control launches</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center bg-[#F5F5F5] rounded-full p-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#2D2D2D] shadow-sm'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === 'approvals'
                  ? 'bg-white text-[#2D2D2D] shadow-sm'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Approvals
              {analytics?.pendingProducts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D2D2D] text-white text-xs rounded-full flex items-center justify-center">
                  {analytics.pendingProducts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === 'queue'
                  ? 'bg-white text-[#2D2D2D] shadow-sm'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Queue
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === 'live'
                  ? 'bg-white text-[#2D2D2D] shadow-sm'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Live Now
            </button>
          </div>
        </div>

        {/* Status Filter (only for approvals tab) */}
        {activeTab === 'approvals' && (
          <div className="mb-6">
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    selectedStatus === status
                      ? 'bg-[#2D2D2D] text-white'
                      : 'bg-white text-[#666666] border border-[#E5E5E5] hover:border-[#D5D5D5]'
                  }`}
                >
                  {status}
                  {status === 'pending' && analytics?.pendingProducts > 0 && (
                    <span className="ml-2 text-xs">({analytics.pendingProducts})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {/* Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Users</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{analytics?.totalUsers || 0}</div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Products</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{analytics?.totalProducts || 0}</div>
                {analytics?.pendingProducts > 0 && (
                  <div className="text-sm text-[#666666] mt-1">{analytics.pendingProducts} pending</div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Votes</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{analytics?.totalVotes || 0}</div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Live Now</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{liveProducts.length}</div>
              </div>
            </div>

            {/* Weekly Cycle Management */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#2D2D2D] mb-6">Week Management</h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    if (!confirm('Close the current week and determine winners?')) return
                    
                    try {
                      const response = await fetch('/api/trigger-weekly-cycle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'close_week' })
                      })
                      
                      if (response.ok) {
                        toast.success('Week closed successfully!')
                        loadAnalytics()
                      } else {
                        const error = await response.json()
                        toast.error(error.error || 'Failed to close week')
                      }
                    } catch (error) {
                      toast.error('Failed to close week')
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#D5D5D5] transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-[#2D2D2D]">Close Week</div>
                    <div className="text-sm text-[#666666]">Determine winners and archive</div>
                  </div>
                  <Square className="h-5 w-5 text-[#999999]" />
                </button>
                
                <button
                  onClick={async () => {
                    if (!confirm('Start a new week?')) return
                    
                    try {
                      const response = await fetch('/api/trigger-weekly-cycle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'start_week' })
                      })
                      
                      if (response.ok) {
                        toast.success('New week started successfully!')
                        loadAnalytics()
                      } else {
                        const error = await response.json()
                        toast.error(error.error || 'Failed to start week')
                      }
                    } catch (error) {
                      toast.error('Failed to start week')
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#D5D5D5] transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-[#2D2D2D]">Start Week</div>
                    <div className="text-sm text-[#666666]">Begin Monday competition</div>
                  </div>
                  <Play className="h-5 w-5 text-[#999999]" />
                </button>
              </div>
              <p className="text-sm text-[#666666]">
                Note: These actions are typically automated to run on Sunday night (close) and Monday morning (start).
                Use manual triggers only when needed.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div>
                    <div className="text-lg font-semibold text-orange-900">
                      {analytics?.pendingProducts || 0} Products
                    </div>
                    <div className="text-sm text-orange-700">Awaiting approval</div>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </button>

                <button
                  onClick={async () => {
                    const supabase = createClient()
                    
                    // Get the latest completed week's winners
                    const { data: winners, error } = await supabase
                      .from('products')
                      .select(`
                        name,
                        tagline,
                        website_url,
                        vote_count,
                        users!created_by (
                          first_name,
                          last_name,
                          handle,
                          email
                        )
                      `)
                      .eq('is_live', true)
                      .order('vote_count', { ascending: false })
                      .limit(3)
                    
                    if (error) {
                      toast.error('Failed to export winners')
                      return
                    }
                    
                    if (!winners || winners.length === 0) {
                      toast.error('No winners to export')
                      return
                    }
                    
                    // Create CSV content
                    const csvHeader = 'Rank,Product Name,Tagline,URL,Votes,Creator Name,Creator Handle,Creator Email\n'
                    const csvRows = winners.map((product: any, index) => {
                      const creatorName = product.users ? `${product.users.first_name || ''} ${product.users.last_name || ''}`.trim() : 'Unknown'
                      const handle = product.users?.handle || 'N/A'
                      const email = product.users?.email || 'N/A'
                      return `${index + 1},"${product.name}","${product.tagline}","${product.website_url}",${product.vote_count},"${creatorName}","${handle}","${email}"`
                    }).join('\n')
                    
                    const csvContent = csvHeader + csvRows
                    
                    // Create and download the file
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `winners-${new Date().toISOString().split('T')[0]}.csv`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                    
                    toast.success('Winners exported successfully!')
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#D5D5D5] transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-[#2D2D2D]">Export Winners</div>
                    <div className="text-sm text-[#666666]">Download CSV for newsletter</div>
                  </div>
                  <span className="text-[#999999]">↓</span>
                </button>

                <button
                  onClick={() => setActiveTab('queue')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#D5D5D5] transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-[#2D2D2D]">
                      View Queue
                    </div>
                    <div className="text-sm text-[#666666]">{queueProducts.length} products waiting</div>
                  </div>
                  <span className="text-[#999999]">→</span>
                </button>
              </div>
            </div>

            {/* Top Products This Week */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">Top Products</h3>
              <div className="space-y-3">
                {liveProducts.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#999999]">{index + 1}.</span>
                      <span className="text-sm text-[#2D2D2D]">{product.name}</span>
                    </div>
                    <span className="text-sm text-[#666666]">{product.vote_count || 0} votes</span>
                  </div>
                ))}
                {liveProducts.length === 0 && (
                  <div className="text-center text-[#999999] py-4">No live products yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-[#E5E5E5] hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {product.logo_url ? (
                        <img
                          src={product.logo_url}
                          alt={product.name}
                          className="h-16 w-16 rounded-xl object-cover border border-[#E5E5E5]"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-[#F5F5F5] rounded-xl flex items-center justify-center border border-[#E5E5E5]">
                          <span className="text-[#666666] font-medium text-lg">{product.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-[#2D2D2D]">{product.name}</h3>
                        <p className="text-[#666666] mt-1">{product.tagline}</p>
                        <p className="text-sm text-[#999999] mt-2">
                          By {product.users.first_name} {product.users.last_name} 
                          {product.users.handle && ` (@${product.users.handle})`} • {product.users.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        <span className="capitalize">{product.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-[#666666] mb-4 line-clamp-3 [&_p]:inline [&_ul]:inline [&_li]:inline [&_h3]:inline [&_strong]:font-semibold">
                    <MarkdownRenderer content={product.description} />
                  </div>

                  {product.admin_notes && (
                    <div className="mb-4 p-3 bg-[#F5F5F5] rounded-lg">
                      <div className="text-sm text-[#666666] mb-1">Admin Notes</div>
                      <p className="text-sm text-[#2D2D2D]">{product.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                    <div className="flex items-center space-x-4 text-sm text-[#666666]">
                      <span>{new Date(product.created_at).toLocaleDateString()}</span>
                      <a
                        href={product.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-[#666666] hover:text-[#2D2D2D] transition-colors"
                      >
                        <span>Visit site</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    
                    {product.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateProductStatus(product.id, 'approved')}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-[#2D2D2D] hover:bg-[#1D1D1D] transition-colors"
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Rejection reason (optional):')
                            updateProductStatus(product.id, 'rejected', notes || '')
                          }}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-[#666666] bg-white border border-[#E5E5E5] hover:border-[#D5D5D5] transition-all"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-[#E5E5E5]">
                <div className="text-[#999999] text-6xl mb-4">⦰</div>
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">No products found</h3>
                <p className="text-[#666666]">
                  No products match the selected status filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2D2D]">Launch Queue</h2>
                <p className="text-[#666666] mt-1">Drag products to reorder the launch sequence</p>
              </div>
              <button
                onClick={async () => {
                  const supabase = createClient()
                  const { data, error } = await supabase.rpc('auto_weekly_transition')
                  
                  if (error) {
                    toast.error(`Test failed: ${error.message}`)
                  } else {
                    const result = data?.[0]
                    toast.success(`Test successful: ${result?.products_made_live} products made live`)
                    loadProducts()
                    loadQueueProducts()
                    loadLiveProducts()
                  }
                }}
                className="bg-white text-[#666666] border border-[#E5E5E5] px-4 py-2 rounded-full hover:border-[#D5D5D5] transition-colors text-sm font-medium"
              >
                Test Transition
              </button>
            </div>

            {/* Automatic System Info */}
            <div className="bg-[#F5F5F5] rounded-xl p-6 mb-6">
              <h3 className="font-medium text-[#2D2D2D] mb-4">Queue System</h3>
              <div className="text-sm text-[#666666] space-y-2">
                <p>• Top 10 products launch when timer reaches 0</p>
                <p>• Drag to reorder queue priority</p>
                <p>• Products 1-10 will go live next week</p>
              </div>
            </div>

            {/* Current Week Status */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Currently Live</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{liveProducts.length}</div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#999999] mb-2">Next Week</div>
                <div className="text-3xl font-semibold text-[#2D2D2D]">{Math.min(queueProducts.length, 10)}</div>
              </div>
            </div>

            {/* Queue List */}
            <div className="space-y-3">
              {queueProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`bg-white rounded-xl border transition-all hover:border-[#D5D5D5] ${
                    product.queue_position && product.queue_position <= 10
                      ? 'border-[#2D2D2D]'
                      : 'border-[#E5E5E5]'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Position Badge */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm ${
                          product.queue_position && product.queue_position <= 10
                            ? 'bg-[#2D2D2D] text-white'
                            : 'bg-[#F5F5F5] text-[#666666]'
                        }`}>
                          {product.queue_position}
                        </div>
                        
                        {/* Product Logo */}
                        {product.logo_url ? (
                          <img
                            src={product.logo_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-[#E5E5E5]"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center border border-[#E5E5E5]">
                            <span className="text-[#666666] font-medium">{product.name.charAt(0)}</span>
                          </div>
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2D2D2D]">{product.name}</h3>
                          <p className="text-sm text-[#666666] mt-0.5">{product.tagline}</p>
                          <p className="text-xs text-[#999999] mt-1">
                            by {product.users.first_name} {product.users.last_name}
                            {product.users.handle && ` (@${product.users.handle})`}
                          </p>
                        </div>
                        
                        {/* Status Badge */}
                        {product.queue_position && product.queue_position <= 10 && (
                          <span className="text-xs font-medium text-[#666666]">
                            Launches next
                          </span>
                        )}
                      </div>
                      
                      {/* Reorder Controls */}
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => moveInQueue(product.id, 'up')}
                          disabled={product.queue_position === 1}
                          className="p-2 text-[#666666] hover:text-[#2D2D2D] hover:bg-[#F5F5F5] rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveInQueue(product.id, 'down')}
                          disabled={product.queue_position === queueProducts.length}
                          className="p-2 text-[#666666] hover:text-[#2D2D2D] hover:bg-[#F5F5F5] rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {queueProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-[#E5E5E5]">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">Queue is empty</h3>
                  <p className="text-[#666666]">
                    Approve some products to add them to the launch queue.
                  </p>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="mt-4 px-4 py-2 bg-[#2D2D2D] text-white rounded-full hover:bg-[#1D1D1D] transition-colors text-sm font-medium"
                  >
                    Go to Approvals
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Products Tab */}
        {activeTab === 'live' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2D2D2D]">Currently Live Products</h2>
              <p className="text-[#666666] mt-1">Products competing in this week's competition</p>
            </div>
            
            <div className="space-y-4">
              {liveProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-xl border border-[#E5E5E5] hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Product Logo */}
                        {product.logo_url ? (
                          <img
                            src={product.logo_url}
                            alt={product.name}
                            className="h-16 w-16 rounded-xl object-cover border border-[#E5E5E5]"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-[#F5F5F5] rounded-xl flex items-center justify-center border border-[#E5E5E5]">
                            <span className="text-[#666666] font-medium text-lg">{product.name.charAt(0)}</span>
                          </div>
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#2D2D2D]">{product.name}</h3>
                          <p className="text-[#666666] mt-1">{product.tagline}</p>
                          <p className="text-sm text-[#999999] mt-2">
                            By {product.users.first_name} {product.users.last_name}
                            {product.users.handle && ` (@${product.users.handle})`}
                          </p>
                          
                          {/* Description */}
                          <div className="text-sm text-[#666666] mt-3 line-clamp-2 [&_p]:inline [&_ul]:inline [&_li]:inline [&_h3]:inline [&_strong]:font-semibold">
                            <MarkdownRenderer content={product.description} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Live Status */}
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#2D2D2D] text-white">
                        <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
                        Live
                      </span>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E5E5]">
                      <div className="flex items-center space-x-4 text-sm text-[#666666]">
                        <span>Launched {new Date(product.created_at).toLocaleDateString()}</span>
                        {product.launch_week_id && (
                          <span className="px-2 py-0.5 bg-[#F5F5F5] rounded text-xs">
                            Week #{product.launch_week_id.slice(-4)}
                          </span>
                        )}
                      </div>
                      <a
                        href={product.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#2D2D2D] border border-[#E5E5E5] rounded-lg hover:border-[#D5D5D5] transition-all"
                      >
                        <span>Visit Product</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {liveProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-[#E5E5E5]">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">No live products</h3>
                  <p className="text-[#666666] mb-6">
                    No products are currently live. Wait for the next weekly transition.
                  </p>
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="px-4 py-2 bg-[#2D2D2D] text-white rounded-full hover:bg-[#1D1D1D] transition-colors text-sm font-medium"
                  >
                    View Queue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 