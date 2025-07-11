import { getSupabaseClient } from './client-singleton'

export const createClient = () => {
  return getSupabaseClient()
}