'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { LogOut, User, Settings, Package, TrendingUp, Award, Plus, Lock } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { useUserProfile } from '@/contexts/UserProfileContext'


export default function Header() {
  const { user, signOut } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()
  const [showDropdown, setShowDropdown] = useState(false)
  const { openLoginModal } = useLoginModal()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
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
    <>
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
          <nav className="hidden xl:flex items-center">
            <div className="flex items-center bg-[#F5F5F5] rounded-full p-1">
              <Link 
                href="/" 
                className={`relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/' 
                    ? 'text-[#2D2D2D] bg-white shadow-sm' 
                    : 'text-[#666666] hover:text-[#2D2D2D] hover:bg-white/50'
                }`}
              >
                Launching Now
              </Link>
              <div className="relative group">
                <button 
                  className="relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 text-[#999999] cursor-not-allowed"
                  disabled
                >
                  Latest Winners
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-[#2D2D2D] text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                    Available after the first launch on Aug 4th
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#2D2D2D]"></div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button 
                  className="relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 text-[#999999] cursor-not-allowed"
                  disabled
                >
                  Past Launches
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-[#2D2D2D] text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                    Available after the first launch on Aug 4th
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#2D2D2D]"></div>
                  </div>
                </div>
              </div>
            </div>
            <Link 
              href="/how-it-works" 
              className={`ml-4 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                pathname === '/how-it-works'
                  ? 'text-[#2D2D2D] bg-white border-2 border-[#E5E5E5]'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              How it Works
            </Link>
            <Link 
              href="/pricing" 
              className={`ml-4 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                pathname === '/pricing'
                  ? 'text-[#2D2D2D] bg-white border-2 border-[#E5E5E5]'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className={`ml-4 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                pathname === '/blog'
                  ? 'text-[#2D2D2D] bg-white border-2 border-[#E5E5E5]'
                  : 'text-[#666666] hover:text-[#2D2D2D]'
              }`}
            >
              Newsletter
            </Link>
            {/* Admin link - show skeleton while loading */}
            {user && profileLoading ? (
              <div className="ml-6 px-4 py-2 bg-gray-100 rounded-full animate-pulse h-9 w-16" />
            ) : (
              profile?.is_admin && (
                <Link 
                  href="/admin" 
                  className={`ml-6 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pathname === '/admin'
                      ? 'text-white bg-purple-600 shadow-sm'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </Link>
              )
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Submit button - always visible and always on the left */}
            {user ? (
              profileLoading ? (
                <div className="bg-gray-100 rounded-lg animate-pulse h-10 w-28" />
              ) : (
                profile?.profile_completed && (
                  <Link
                    href="/submit"
                    className="bg-[#FDFCFA] text-[#2D2D2D] border-[3px] border-orange-400/50 px-5 py-2 rounded-lg text-sm font-medium hover:border-orange-500 transition-all flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-1.5 stroke-2" />
                    Submit
                  </Link>
                )
              )
            ) : (
              <button
                onClick={() => openLoginModal('/submit')}
                className="bg-[#FDFCFA] text-[#2D2D2D] border-[3px] border-orange-400/50 px-5 py-2 rounded-lg text-sm font-medium hover:border-orange-500 transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-1.5 stroke-2" />
                Submit
              </button>
            )}

            {user ? (
              <>
                {/* Profile completion warning */}
                {profileLoading ? null : (
                  profile && !profile.profile_completed && (
                    <Link
                      href="/dashboard?tab=profile"
                      className="bg-orange-50 text-orange-600 border-2 border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 hover:border-orange-300 transition-all"
                    >
                      Complete Profile
                    </Link>
                  )
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
                      {profileLoading ? 'Loading...' : getDisplayName()}
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
              <button
                onClick={() => openLoginModal(pathname)}
                className="text-[#666666] hover:text-[#2D2D2D] font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  )
} 