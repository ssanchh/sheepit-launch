'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { LogOut, User, Settings } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🐑</span>
              <span className="text-xl font-bold text-gray-900">Sheep It</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Launching Now
            </Link>
            <span className="text-gray-400 font-medium cursor-not-allowed">
              Latest Winners
            </span>
            <span className="text-gray-400 font-medium cursor-not-allowed">
              Past Launches
            </span>
            {profile?.is_admin && (
              <Link href="/admin" className="text-purple-600 hover:text-purple-800 font-medium">
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
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-200"
                  >
                    Complete Profile
                  </Link>
                )}

                <Link
                  href="/submit"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                >
                  Submit Product
                </Link>
                
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
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                        {getAvatarInitials()}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {getDisplayName()}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings className="inline h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setShowDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                  href="/submit"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                >
                  Submit Product
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 