import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/weekly'

  console.log('[AUTH CALLBACK] Starting auth callback with code:', code ? 'present' : 'missing')

  if (!code) {
    console.log('[AUTH CALLBACK] No code found, redirecting to login')
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  const supabase = createClient()
  console.log('[AUTH CALLBACK] Created Supabase client')

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('[AUTH CALLBACK] Exchange result:', { 
      error, 
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      userEmail: data?.user?.email 
    })

    if (error) {
      console.error('[AUTH CALLBACK] Supabase auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }

    if (data?.session) {
      console.log('[AUTH CALLBACK] Session established successfully')
      console.log('[AUTH CALLBACK] Redirecting to:', `${requestUrl.origin}${next}`)
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } else {
      console.log('[AUTH CALLBACK] No session in response')
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_session`)
    }
  } catch (err) {
    console.error('[AUTH CALLBACK] Exception during auth:', err)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=exception`)
  }
} 