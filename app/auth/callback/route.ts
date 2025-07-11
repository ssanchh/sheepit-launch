import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/service'
import { handleNewUserSignup } from '@/lib/newsletter/weekly-sync'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  const supabase = createClient()

  try {
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }

    // Check if this is a new user
    if (authData?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('created_at, email, first_name')
        .eq('id', authData.user.id)
        .single()
      
      if (userData) {
        // Check if user was created in the last 5 minutes (new user)
        const createdAt = new Date(userData.created_at)
        const now = new Date()
        const isNewUser = (now.getTime() - createdAt.getTime()) < 5 * 60 * 1000 // 5 minutes
        
        if (isNewUser) {
          // Send welcome email
          await sendWelcomeEmail(
            userData.email,
            authData.user.id,
            userData.first_name
          )
          
          // Subscribe to newsletter (if they haven't opted out)
          await handleNewUserSignup(
            authData.user.id,
            userData.email,
            userData.first_name,
            true // Default to opt-in, could be controlled by a checkbox during signup
          )
        }
      }
    }

    // Force redirect to ensure cookies are set
    const response = NextResponse.redirect(`${requestUrl.origin}${next}`)
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=exception`)
  }
} 