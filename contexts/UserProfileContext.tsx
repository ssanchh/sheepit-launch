'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface UserProfile {
  first_name: string
  last_name: string
  handle: string
  avatar_url: string
  profile_completed: boolean
  is_admin: boolean
}

interface UserProfileContextType {
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const lastUserIdRef = useRef<string | null>(null)

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await createClient()
        .from('users')
        .select('first_name, last_name, handle, avatar_url, profile_completed, is_admin')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  // Load profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      lastUserIdRef.current = null
      return
    }

    // Only reload if user ID actually changed
    if (user.id === lastUserIdRef.current && profile !== null) {
      setLoading(false)
      return
    }

    // Don't reset loading state if we already have a profile for this user
    if (user.id !== lastUserIdRef.current) {
      setLoading(true)
    }

    lastUserIdRef.current = user.id
    loadProfile(user.id)
  }, [user?.id])

  // Refresh profile function for manual updates
  const refreshProfile = async () => {
    if (user?.id) {
      setLoading(true)
      await loadProfile(user.id)
    }
  }

  return (
    <UserProfileContext.Provider value={{ profile, loading, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}