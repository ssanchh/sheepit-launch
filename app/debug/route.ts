import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  
  // Get Supabase session
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  return NextResponse.json({
    cookies: allCookies,
    session: session ? {
      user: session.user,
      expires_at: session.expires_at,
      access_token: session.access_token ? 'present' : 'missing'
    } : null,
    error: error,
    timestamp: new Date().toISOString()
  })
} 