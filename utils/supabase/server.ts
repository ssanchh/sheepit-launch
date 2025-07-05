import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => {
          return cookieStore.get(key)?.value
        },
        set: (key: string, value: string, options: any) => {
          try {
            cookieStore.set(key, value, {
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: true,
              httpOnly: false
            })
          } catch (error) {
            console.log('Cookie set error:', error)
          }
        },
        remove: (key: string, options: any) => {
          try {
            cookieStore.set(key, '', {
              ...options,
              path: '/',
              expires: new Date(0)
            })
          } catch (error) {
            console.log('Cookie remove error:', error)
          }
        }
      }
    }
  )
} 