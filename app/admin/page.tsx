'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock, ExternalLink, MessageSquare } from 'lucide-react'

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

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      loadProducts()
    }
  }, [isAdmin, selectedStatus])

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
        users (
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
      toast.error('Failed to load products')
    } else {
      setProducts(data || [])
    }
    setLoadingProducts(false)
  }

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected', notes?: string) => {
    const supabase = createClient()
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
      toast.success(`Product ${status}!`)
      loadProducts()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage product submissions and approvals</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                  selectedStatus === status
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {product.logo_url && (
                    <img
                      src={product.logo_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">{product.tagline}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By {product.users.first_name} {product.users.last_name} 
                      {product.users.handle && ` (@${product.users.handle})`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="ml-1 capitalize">{product.status}</span>
                  </span>
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{product.description}</p>

              {product.admin_notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Admin Notes
                  </div>
                  <p className="text-sm text-gray-700">{product.admin_notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Submitted: {new Date(product.created_at).toLocaleDateString()}
                </div>
                
                {product.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateProductStatus(product.id, 'approved')}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-800 bg-green-100 hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Rejection reason (optional):')
                        updateProductStatus(product.id, 'rejected', notes || '')
                      }}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              No products match the selected status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 