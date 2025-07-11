'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

  const loadProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, handle, avatar_url, profile_completed, is_admin')
        .eq('id', user.id)
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
    setLoading(true)
    loadProfile()
  }, [user?.id])

  // Refresh profile function for manual updates
  const refreshProfile = async () => {
    await loadProfile()
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