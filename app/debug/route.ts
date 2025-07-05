import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: session ? {
        user_id: session.user?.id,
        email: session.user?.email,
        expires_at: session.expires_at
      } : null,
      error: error?.message,
      has_session: !!session,
      has_user: !!session?.user
    })
  } catch (err) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Unknown error',
      session: null,
      has_session: false,
      has_user: false
    })
  }
} 