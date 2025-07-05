'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      console.log('[DEBUG] Getting initial session...')
      
      // Check if cookies exist
      const allCookies = document.cookie
      console.log('[DEBUG] All cookies:', allCookies)
      
      // Look for Supabase auth cookies specifically
      const authCookies = allCookies.split('; ').filter(cookie => 
        cookie.includes('sb-') || cookie.includes('auth')
      )
      console.log('[DEBUG] Auth-related cookies:', authCookies)
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('[DEBUG] Session result:', { session, error })
        
        if (error) {
          console.error('[DEBUG] Session error:', error)
          setUser(null)
        } else if (session?.user) {
          console.log('[DEBUG] User found in session:', session.user.email)
          setUser(session.user)
        } else {
          console.log('[DEBUG] No user found in session')
          setUser(null)
        }
      } catch (err) {
        console.error('[DEBUG] Session fetch error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[DEBUG] Auth state changed:', { event, session })
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    return { error }
  }

  // Alternative: Sign in with Google in a new tab
  const signInWithGoogleNewTab = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: true,
      },
    })

    if (error) {
      return { error }
    }

    // Open in new tab
    window.open(data.url, '_blank')
    return { error: null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signInWithGoogleNewTab,
    signOut,
  }
} 