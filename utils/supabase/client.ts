import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => {
          if (typeof document === 'undefined') return undefined
          const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(key + '='))
          return cookie ? cookie.split('=')[1] : undefined
        },
        set: (key: string, value: string, options: any) => {
          if (typeof document === 'undefined') return
          let cookieString = `${key}=${value}; path=/; SameSite=Lax`
          if (options.maxAge) {
            cookieString += `; Max-Age=${options.maxAge}`
          }
          document.cookie = cookieString
        },
        remove: (key: string, options: any) => {
          if (typeof document === 'undefined') return
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    }
  )
} 