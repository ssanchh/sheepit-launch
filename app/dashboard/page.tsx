'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Header from '../../components/Header'
import { Plus, Package, User, TrendingUp, Lock, Award, Download, CreditCard, Zap, Crown, Mail } from 'lucide-react'
import Link from 'next/link'
import PurchaseModal from '../../components/PurchaseModal'
import EmailPreferences from '../../components/EmailPreferences'
import BadgesSection from '../../components/BadgesSection'
import { useLoginModal } from '@/contexts/LoginModalContext'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openLoginModal } = useLoginModal()
  const { user, loading } = useAuth()
  
  // Initialize activeTab from URL or default to 'profile'
  const initialTab = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [profileCheckComplete, setProfileCheckComplete] = useState(false)

  useEffect(() => {
    console.log('Dashboard useEffect - user:', user)
    if (!loading && !user) {
      console.log('No user found, opening login modal')
      openLoginModal('/dashboard')
      return
    }
    
    if (user) {
      console.log('User found, dashboard should load')
      // Check profile completion status
      checkProfileCompletion()
      setDashboardLoading(false)
    }
  }, [user, router, loading])

  // Separate effect for handling tab changes
  useEffect(() => {
    if (!user || dashboardLoading || !profileCheckComplete) return
    
    const tabParam = searchParams.get('tab')
    if (tabParam && ['products', 'profile', 'analytics', 'badges', 'payments', 'email'].includes(tabParam)) {
      // Check if tab is accessible
      if (tabParam === 'profile' || profileCompleted) {
        setActiveTab(tabParam)
      } else {
        // If trying to access a locked tab, redirect to profile
        setActiveTab('profile')
        router.replace('/dashboard?tab=profile')
      }
    } else if (!tabParam) {
      // If no tab param, default based on profile completion
      const defaultTab = profileCompleted ? 'products' : 'profile'
      setActiveTab(defaultTab)
      router.replace(`/dashboard?tab=${defaultTab}`)
    }
  }, [user, router, searchParams, dashboardLoading, profileCompleted, profileCheckComplete])

  const checkProfileCompletion = async () => {
    if (!user) return
    
    const { data, error } = await createClient()
      .from('users')
      .select('profile_completed')
      .eq('id', user.id)
      .single()
    
    if (data) {
      setProfileCompleted(data.profile_completed || false)
    }
    setProfileCheckComplete(true)
  }

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1E1E1E]"></div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'products', name: 'My Products', icon: Package },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'badges', name: 'Badges', icon: Award },
    { id: 'email', name: 'Email Preferences', icon: Mail }
  ]

  const renderTabContent = () => {
    if (!user) return null // This should never happen due to the loading check above
    
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={user} onProfileComplete={() => {
          setProfileCompleted(true)
          checkProfileCompletion()
        }} />
      case 'products':
        return <ProductsSection user={user} />
      case 'payments':
        return <PaymentsSection user={user} />
      case 'analytics':
        return <AnalyticsSection />
      case 'badges':
        return <BadgesSection userId={user.id} />
      case 'email':
        return <EmailPreferences userId={user.id} />
      default:
        return <ProfileSection user={user} onProfileComplete={() => {
          setProfileCompleted(true)
          checkProfileCompletion()
        }} />
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2D2D2D]">My Dashboard</h1>
          <p className="text-[#666666] mt-1">
            {!profileCompleted 
              ? 'Complete your profile to unlock all features'
              : 'Manage your products, view analytics, and download badges'
            }
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 border border-[#E5E5E5]">
          {tabs.map((tab) => {
            const isLocked = tab.id !== 'profile' && !profileCompleted
            const isDisabled = isLocked
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!isDisabled) {
                    setActiveTab(tab.id)
                    router.push(`/dashboard?tab=${tab.id}`)
                  }
                }}
                disabled={isDisabled}
                className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2D2D2D] text-white'
                    : isLocked
                    ? 'text-[#999999] cursor-not-allowed bg-gray-50'
                    : 'text-[#666666] hover:text-[#2D2D2D] hover:bg-gray-50'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <tab.icon className="w-5 h-5" />
                )}
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

function ProductsSection({ user }: { user: any }) {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProducts()
  }, [])

  const loadUserProducts = async () => {
    if (!user) return
    
    try {
      const { data: products, error } = await createClient()
        .from('products')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        return
      }

      setProducts(products || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E1E1E] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your products...</p>
      </div>
    )
  }

  return (
    <div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E5E5E5]">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#999999]" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">No products yet</h3>
          <p className="text-[#666666] max-w-md mx-auto mb-6">
            Ready to share your creation with the community?
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Products Grid */}
          <div className="grid gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

function PaymentsSection({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    if (!user) return
    
    const supabase = createClient()
    try {
      const { data, error } = await createClient()
        .from('payments')
        .select(`
          *,
          products (
            name,
            tagline,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading payments:', error)
        return
      }

      setPayments(data || [])
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', className: 'text-green-600 bg-green-50' }
      case 'pending':
        return { text: 'Pending', className: 'text-yellow-600 bg-yellow-50' }
      case 'failed':
        return { text: 'Failed', className: 'text-red-600 bg-red-50' }
      case 'refunded':
        return { text: 'Refunded', className: 'text-gray-600 bg-gray-50' }
      default:
        return { text: status, className: 'text-gray-600 bg-gray-50' }
    }
  }

  const getPaymentType = (type: string) => {
    switch (type) {
      case 'skip_queue':
        return { text: 'Premium Launch', icon: Zap }
      case 'featured_product':
        return { text: 'Featured Spot', icon: Crown }
      default:
        return { text: type, icon: CreditCard }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-[#E5E5E5]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-[#E5E5E5]">
      <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6">Payment History</h2>
      
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-[#E5E5E5] mx-auto mb-4" />
          <p className="text-[#666666] mb-4">No payments yet</p>
          <Link 
            href="/pricing"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            View pricing options →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const status = getPaymentStatus(payment.status)
            const type = getPaymentType(payment.payment_type)
            const Icon = type.icon
            
            return (
              <div key={payment.id} className="border border-[#E5E5E5] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#666666]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#2D2D2D]">{type.text}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>
                          {status.text}
                        </span>
                      </div>
                      {payment.products && (
                        <p className="text-sm text-[#666666] mt-1">
                          For: {payment.products.name}
                        </p>
                      )}
                      <p className="text-xs text-[#999999] mt-1">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#2D2D2D]">
                      ${payment.amount}
                    </p>
                    {payment.receipt_url && payment.status === 'completed' && (
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#666666] hover:text-[#2D2D2D] mt-1 inline-block"
                      >
                        View receipt →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfileSection({ user, onProfileComplete }: { user: any, onProfileComplete?: () => void }) {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    handle: '',
    twitter_handle: '',
    website_url: '',
    avatar_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    const { data, error } = await createClient()
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        handle: data.handle || '',
        twitter_handle: data.twitter_handle || '',
        website_url: data.website_url || '',
        avatar_url: data.avatar_url || ''
      })
      setIsProfileComplete(data.profile_completed || false)
    }
    setLoading(false)
  }

  const checkHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 3) {
      setHandleAvailable(null)
      return
    }

    const { data, error } = await createClient()
      .from('users')
      .select('id')
      .eq('handle', handle.toLowerCase())
      .neq('id', user?.id)

    setHandleAvailable(data?.length === 0)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    
    if (field === 'handle') {
      checkHandleAvailability(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!profile.first_name.trim() || !profile.last_name.trim() || !profile.handle.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Validate handle format
    const handleRegex = /^[a-zA-Z0-9_]{5,20}$/
    if (!handleRegex.test(profile.handle)) {
      toast.error('Handle must be 5-20 characters and contain only letters, numbers, and underscores')
      return
    }
    
    // Check if handle is available
    if (handleAvailable === false) {
      toast.error('This handle is already taken')
      return
    }
    
    setSaving(true)

    try {
      console.log('Current user ID:', user?.id)
      
      const { data: existingProfile, error: selectError } = await createClient()
        .from('users')
        .select('id')
        .eq('id', user?.id)
        .single()
        
      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking profile:', selectError)
      }
      
      console.log('Existing profile:', existingProfile)

      // Prepare update data (exclude id and email from updates)
      const updateData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        handle: profile.handle.toLowerCase(),
        twitter_handle: profile.twitter_handle.replace('@', ''),
        website_url: profile.website_url,
        avatar_url: profile.avatar_url,
        profile_completed: true,
        updated_at: new Date().toISOString()
      }

      let result
      // Since we have the auth trigger, user should always exist
      // Force update instead of checking
      console.log('Updating profile with data:', updateData)
      
      result = await createClient()
        .from('users')
        .update(updateData)
        .eq('id', user?.id)
        .select()
        
      console.log('Update result:', result)

      if (result.error) {
        console.error('Profile update error:', result.error)
        throw result.error
      }

      // If profile is newly completed, subscribe to newsletter
      if (!isProfileComplete && updateData.profile_completed) {
        try {
          // Add to newsletter subscribers table
          await createClient()
            .from('newsletter_subscribers')
            .insert({
              email: user?.email,
              user_id: user?.id,
              status: 'active',
              source: 'profile_completion'
            })
          
          // Subscribe to Beehiiv (async, don't wait)
          fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user?.email,
              userId: user?.id,
              source: 'profile_completion'
            })
          })
        } catch (error) {
          console.error('Newsletter subscription error:', error)
          // Don't fail profile update if newsletter fails
        }
      }
      
      // Show success message instead of redirecting
      console.log('Profile saved successfully!')
      toast.success('Profile saved successfully!')
      
      // Call the callback if profile is now complete
      if (onProfileComplete && !isProfileComplete) {
        onProfileComplete()
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      if (error.code === '23505') {
        toast.error('This handle is already taken. Please choose another one.')
      } else if (error.code === 'PGRST116') {
        toast.error('Profile not found. Please refresh the page and try again.')
      } else {
        toast.error(error.message || 'Failed to save profile')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E1E1E] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isProfileComplete && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Complete your profile to unlock features</p>
              <p className="text-sm text-yellow-700 mt-1">
                You must complete all required fields before you can submit products or access analytics.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D2D2D]">Maker Profile</h1>
        <p className="text-[#666666] mt-2">Complete your profile to build credibility and enable other dashboard features</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Handle <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.handle}
              onChange={(e) => handleInputChange('handle', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                handleAvailable === false 
                  ? 'border-red-300 focus:ring-red-500' 
                  : handleAvailable === true 
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-gray-500'
              }`}
              placeholder="your_unique_handle"
            />
            <p className="text-sm text-gray-500 mt-1">
              5-20 characters, letters, numbers, and underscores only
            </p>
            {handleAvailable === false && (
              <p className="text-sm text-red-600 mt-1">Handle is already taken</p>
            )}
            {handleAvailable === true && (
              <p className="text-sm text-green-600 mt-1">Handle is available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X (Twitter) Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">@</span>
              <input
                type="text"
                value={profile.twitter_handle}
                onChange={(e) => handleInputChange('twitter_handle', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="your_twitter_handle"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={profile.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="https://your-website.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={profile.avatar_url}
              onChange={(e) => handleInputChange('avatar_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional. Direct link to your profile image
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || handleAvailable === false}
              className="px-6 py-3 bg-[#1E1E1E] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AnalyticsSection() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your product performance and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-8 rounded-xl border border-gray-100">
          <div className="text-3xl font-bold text-[#1E1E1E] mb-2">0</div>
          <div className="text-sm font-medium text-gray-700">Total Votes</div>
          <div className="text-xs text-gray-500 mt-1">This Week</div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100">
          <div className="text-3xl font-bold text-[#1E1E1E] mb-2">0</div>
          <div className="text-sm font-medium text-gray-700">Comments</div>
          <div className="text-xs text-gray-500 mt-1">All Time</div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100">
          <div className="text-3xl font-bold text-[#1E1E1E] mb-2">0</div>
          <div className="text-sm font-medium text-gray-700">Website Visits</div>
          <div className="text-xs text-gray-500 mt-1">This Month</div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100">
          <div className="text-3xl font-bold text-[#1E1E1E] mb-2">-</div>
          <div className="text-sm font-medium text-gray-700">Highest Position</div>
          <div className="text-xs text-gray-500 mt-1">Best Rank</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-12">
        <div className="text-center py-16">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">Detailed analytics will be available once you launch your first product</p>
        </div>
      </div>
    </div>
  )
}

// Product Card Component (for products list)
function ProductCard({ product }: { product: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'skip_queue' | 'featured_product'>('skip_queue')
  
  const getStatusInfo = () => {
    // Clear logic based on product state
    if (product.status === 'pending') {
      return { text: 'Pending Review', color: 'text-[#666666]', bg: 'bg-[#FFF9F5]', border: 'border-[#FFE5D3]' }
    }
    if (product.status === 'rejected') {
      return { text: 'Rejected', color: 'text-[#666666]', bg: 'bg-[#F5F5F5]', border: 'border-[#E5E5E5]' }
    }
    if (product.status === 'approved') {
      if (product.is_live) {
        return { text: 'Live This Week', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }
      }
      if (product.queue_position) {
        if (product.queue_position <= 10) {
          return { text: `Queue #${product.queue_position} • Next Week`, color: 'text-[#666666]', bg: 'bg-white', border: 'border-[#E5E5E5]' }
        } else {
          return { text: `Queue #${product.queue_position}`, color: 'text-[#999999]', bg: 'bg-white', border: 'border-[#E5E5E5]' }
        }
      }
      return { text: 'Approved', color: 'text-[#666666]', bg: 'bg-white', border: 'border-[#E5E5E5]' }
    }
    return { text: 'Draft', color: 'text-[#999999]', bg: 'bg-[#F5F5F5]', border: 'border-[#E5E5E5]' }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.logo_url ? (
              <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">🚀</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.tagline}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{product.vote_count || 0} votes</span>
              <span>{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
            {statusInfo.text}
          </div>
          <div className="mt-3 flex flex-col gap-2 items-end">
            {/* Action buttons based on status */}
            {product.status === 'approved' && product.queue_position && !product.is_live && (
              <button 
                onClick={() => {
                  setPurchaseType('skip_queue')
                  setShowPurchaseModal(true)
                }}
                className="flex items-center gap-1 text-xs bg-[#2D2D2D] text-white px-3 py-1.5 rounded-md hover:bg-[#1D1D1D] transition-colors"
              >
                <Zap className="w-3 h-3" />
                Skip Queue
              </button>
            )}
            {product.status === 'approved' && !product.payment_status?.includes('featured') && (
              <button 
                onClick={() => {
                  setPurchaseType('featured_product')
                  setShowPurchaseModal(true)
                }}
                className="flex items-center gap-1.5 text-xs bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                Get Featured
              </button>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/product/${product.id}`)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={product}
        type={purchaseType}
        onSuccess={() => {
          setShowPurchaseModal(false)
          // Reload products to reflect changes
          window.location.reload()
        }}
      />
    </div>
  )
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.logo_url ? (
              <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">🚀</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.tagline}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{product.vote_count || 0} votes</span>
              <span>{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
            {statusInfo.text}
          </div>
          <div className="mt-3 flex flex-col gap-2 items-end">
            {/* Action buttons based on status */}
            {product.status === 'approved' && product.queue_position && !product.is_live && (
              <button 
                onClick={() => {
                  setPurchaseType('skip_queue')
                  setShowPurchaseModal(true)
                }}
                className="flex items-center gap-1 text-xs bg-[#2D2D2D] text-white px-3 py-1.5 rounded-md hover:bg-[#1D1D1D] transition-colors"
              >
                <Zap className="w-3 h-3" />
                Skip Queue
              </button>
            )}
            {product.status === 'approved' && !product.payment_status?.includes('featured') && (
              <button 
                onClick={() => {
                  setPurchaseType('featured_product')
                  setShowPurchaseModal(true)
                }}
                className="flex items-center gap-1.5 text-xs bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                Get Featured
              </button>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/product/${product.id}`)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={product}
        type={purchaseType}
        onSuccess={() => {
          setShowPurchaseModal(false)
          // Reload products to reflect changes
          window.location.reload()
        }}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1E1E1E]"></div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

 