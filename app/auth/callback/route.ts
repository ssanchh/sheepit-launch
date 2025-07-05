import { cookies } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/weekly'

  if (code) {
    const supabase = createServerActionClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } else {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
} 