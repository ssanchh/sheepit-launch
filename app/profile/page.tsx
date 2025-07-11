'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { User, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLoginModal } from '@/contexts/LoginModalContext'

interface Profile {
  first_name: string
  last_name: string
  handle: string
  twitter_handle: string
  website_url: string
  avatar_url: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { openLoginModal } = useLoginModal()
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    handle: '',
    twitter_handle: '',
    website_url: '',
    avatar_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
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
    }
    setLoadingProfile(false)
  }

  const checkHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 3) {
      setHandleAvailable(null)
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('handle', handle.toLowerCase())
      .neq('id', user?.id)

    setHandleAvailable(data?.length === 0)
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    
    if (field === 'handle') {
      checkHandleAvailability(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user?.id)
        .single()

      const profileData = {
        id: user?.id,
        email: user?.email,
        ...profile,
        handle: profile.handle.toLowerCase(),
        twitter_handle: profile.twitter_handle.replace('@', ''),
        profile_completed: true,
        updated_at: new Date().toISOString()
      }

      let result
      if (existingProfile) {
        result = await supabase
          .from('users')
          .update(profileData)
          .eq('id', user?.id)
      } else {
        result = await supabase
          .from('users')
          .insert(profileData)
      }

      if (result.error) {
        throw result.error
      }

      toast.success('Profile saved successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(error.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    openLoginModal('/profile')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maker Profile</h1>
              <p className="text-gray-600 mt-2">
                Set up your public maker profile. This information will be displayed on your launches and startup pages.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handle
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
                    : 'border-gray-300 focus:ring-blue-500'
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
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your_twitter_handle"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Optional. Must start with @ if provided
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={profile.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 