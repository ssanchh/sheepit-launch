'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { LogOut, User, Settings, Package, TrendingUp, Award, Plus, Lock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface UserProfile {
  first_name: string
  last_name: string
  handle: string
  avatar_url: string
  profile_completed: boolean
  is_admin: boolean
}

export default function Header() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name, handle, avatar_url, profile_completed, is_admin')
      .eq('id', user?.id)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setProfile(null)
  }

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (profile?.handle) {
      return `@${profile.handle}`
    }
    return user?.email?.split('@')[0] || 'User'
  }

  const getAvatarInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`
    }
    if (profile?.handle) {
      return profile.handle[0]?.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  return (
    <header className="bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/assets/images/logo.svg" 
                alt="Sheep It" 
                width={52} 
                height={52}
                className="w-[52px] h-[52px]"
              />
              <span className="text-xl font-bold text-[#2D2D2D]" style={{ fontFamily: 'Garet, sans-serif' }}>sheep it</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-[#F5F5F5] rounded-full p-1">
              <Link 
                href="/" 
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/' 
                    ? 'text-[#2D2D2D] bg-white shadow-sm' 
                    : 'text-[#666666] hover:text-[#2D2D2D] hover:bg-white/50'
                }`}
              >
                Launching Now
              </Link>
              <Link 
                href="/winners"
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/winners' 
                    ? 'text-[#2D2D2D] bg-white shadow-sm' 
                    : 'text-[#666666] hover:text-[#2D2D2D] hover:bg-white/50'
                }`}
              >
                Latest Winners
              </Link>
              <Link 
                href="/past-launches"
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/past-launches' 
                    ? 'text-[#2D2D2D] bg-white shadow-sm' 
                    : 'text-[#666666] hover:text-[#2D2D2D] hover:bg-white/50'
                }`}
              >
                Past Launches
              </Link>
            </div>
            <Link 
              href="/how-it-works" 
              className={`ml-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                pathname === '/how-it-works'
                  ? 'text-[#2D2D2D] bg-white border-2 border-[#E5E5E5]'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              How it Works
            </Link>
            <Link 
              href="/pricing" 
              className={`ml-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                pathname === '/pricing'
                  ? 'text-[#2D2D2D] bg-white border-2 border-[#E5E5E5]'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Pricing
            </Link>
            {profile?.is_admin && (
              <Link 
                href="/admin" 
                className={`ml-4 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/admin'
                    ? 'text-white bg-purple-600 shadow-sm'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile completion warning */}
                {profile && !profile.profile_completed && (
                  <Link
                    href="/profile"
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors"
                  >
                    Complete Profile
                  </Link>
                )}

                {profile?.profile_completed && (
                  <Link
                    href="/submit"
                    className="bg-[#FDFCFA] text-[#2D2D2D] border-[3px] border-orange-400/50 px-5 py-2 rounded-lg text-sm font-medium hover:border-orange-500 transition-all flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-1.5 stroke-2" />
                    Submit
                  </Link>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={getDisplayName()}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-sm font-medium text-[#666666]">
                        {getAvatarInitials()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-[#2D2D2D]">
                      {getDisplayName()}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E5E5E5] py-2 z-10">
                      <Link
                        href="/dashboard?tab=profile"
                        className="block px-4 py-2 text-sm text-[#666666] hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="inline h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard?tab=products"
                        className="block px-4 py-2 text-sm text-[#666666] hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Package className="inline h-4 w-4 mr-2" />
                        My products
                      </Link>
                      <Link
                        href="/dashboard?tab=analytics"
                        className="block px-4 py-2 text-sm text-[#666666] hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <TrendingUp className="inline h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                      <Link
                        href="/dashboard?tab=badges"
                        className="block px-4 py-2 text-sm text-[#666666] hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Award className="inline h-4 w-4 mr-2" />
                        Badges
                      </Link>
                      <div className="border-t border-[#E5E5E5] my-2"></div>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setShowDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#666666] hover:bg-gray-50"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#666666] hover:text-[#2D2D2D] font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Submit
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 