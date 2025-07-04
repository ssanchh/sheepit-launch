export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          tagline: string
          description: string
          website_url: string
          logo_url: string | null
          video_url: string | null
          created_by: string
          created_at: string
          updated_at: string
          approved: boolean
          week_id: string
          featured: boolean
        }
        Insert: {
          id?: string
          name: string
          tagline: string
          description: string
          website_url: string
          logo_url?: string | null
          video_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          approved?: boolean
          week_id: string
          featured?: boolean
        }
        Update: {
          id?: string
          name?: string
          tagline?: string
          description?: string
          website_url?: string
          logo_url?: string | null
          video_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          approved?: boolean
          week_id?: string
          featured?: boolean
        }
      }
      weeks: {
        Row: {
          id: string
          start_date: string
          end_date: string
          created_at: string
          active: boolean
        }
        Insert: {
          id?: string
          start_date: string
          end_date: string
          created_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          start_date?: string
          end_date?: string
          created_at?: string
          active?: boolean
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          product_id: string
          week_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          week_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          week_id?: string
          created_at?: string
        }
      }
      winners: {
        Row: {
          id: string
          product_id: string
          week_id: string
          position: number
          badge_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          week_id: string
          position: number
          badge_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          week_id?: string
          position?: number
          badge_url?: string | null
          created_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          email: string
          name: string
          newsletter_name: string
          utm_source: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          newsletter_name: string
          utm_source: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          newsletter_name?: string
          utm_source?: string
          active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Week = Database['public']['Tables']['weeks']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Winner = Database['public']['Tables']['winners']['Row']
export type Partner = Database['public']['Tables']['partners']['Row']

export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type WeekInsert = Database['public']['Tables']['weeks']['Insert']

export interface ProductWithVotes extends Product {
  votes: Vote[]
  vote_count: number
  user_vote?: Vote | null
}

export interface WeekWithProducts extends Week {
  products: ProductWithVotes[]
}

export interface ProductWithUser extends Product {
  user: User
} 