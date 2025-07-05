'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('🔍 [DEBUG] Getting initial session...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('📧 [DEBUG] Session result:', { session, error, user: session?.user })
        
        if (session?.user) {
          console.log('✅ [DEBUG] User found:', session.user.email)
        } else {
          console.log('❌ [DEBUG] No user found in session')
        }
        
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (err) {
        console.error('🚨 [DEBUG] Error getting session:', err)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [DEBUG] Auth state changed:', { event, session, user: session?.user })
        if (session?.user) {
          console.log('✅ [DEBUG] User from auth change:', session.user.email)
        }
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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