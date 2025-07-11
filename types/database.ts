export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          handle: string | null
          avatar_url: string | null
          twitter_handle: string | null
          website_url: string | null
          profile_completed: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          handle?: string | null
          avatar_url?: string | null
          twitter_handle?: string | null
          website_url?: string | null
          profile_completed?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          handle?: string | null
          avatar_url?: string | null
          twitter_handle?: string | null
          website_url?: string | null
          profile_completed?: boolean
          is_admin?: boolean
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
          week_id: string
          status: 'pending' | 'approved' | 'rejected'
          featured: boolean
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          queue_position: number | null
          launch_week_id: string | null
          is_live: boolean
          payment_status: string
          paid_features: any
          created_at: string
          updated_at: string
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
          week_id: string
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          queue_position?: number | null
          launch_week_id?: string | null
          is_live?: boolean
          payment_status?: string
          paid_features?: any
          created_at?: string
          updated_at?: string
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
          week_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          queue_position?: number | null
          launch_week_id?: string | null
          is_live?: boolean
          payment_status?: string
          paid_features?: any
          created_at?: string
          updated_at?: string
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
      comments: {
        Row: {
          id: string
          content: string
          user_id: string
          product_id: string
          week_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          product_id: string
          week_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          product_id?: string
          week_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          payment_type: 'skip_queue' | 'featured_product'
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          ls_order_id: string | null
          ls_product_id: string | null
          ls_variant_id: string | null
          ls_customer_id: string | null
          ls_subscription_id: string | null
          checkout_url: string | null
          receipt_url: string | null
          created_at: string
          completed_at: string | null
          expires_at: string | null
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          payment_type: 'skip_queue' | 'featured_product'
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          ls_order_id?: string | null
          ls_product_id?: string | null
          ls_variant_id?: string | null
          ls_customer_id?: string | null
          ls_subscription_id?: string | null
          checkout_url?: string | null
          receipt_url?: string | null
          created_at?: string
          completed_at?: string | null
          expires_at?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          payment_type?: 'skip_queue' | 'featured_product'
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          ls_order_id?: string | null
          ls_product_id?: string | null
          ls_variant_id?: string | null
          ls_customer_id?: string | null
          ls_subscription_id?: string | null
          checkout_url?: string | null
          receipt_url?: string | null
          created_at?: string
          completed_at?: string | null
          expires_at?: string | null
          metadata?: any
        }
      }
      queue_skips: {
        Row: {
          id: string
          payment_id: string
          product_id: string
          original_position: number
          new_position: number
          applied: boolean
          applied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          product_id: string
          original_position: number
          new_position: number
          applied?: boolean
          applied_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          product_id?: string
          original_position?: number
          new_position?: number
          applied?: boolean
          applied_at?: string | null
          created_at?: string
        }
      }
      featured_purchases: {
        Row: {
          id: string
          payment_id: string
          product_id: string
          start_date: string
          end_date: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          product_id: string
          start_date: string
          end_date: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          product_id?: string
          start_date?: string
          end_date?: string
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
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      payment_type: 'skip_queue' | 'featured_product'
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Week = Database['public']['Tables']['weeks']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Winner = Database['public']['Tables']['winners']['Row']
export type Partner = Database['public']['Tables']['partners']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type QueueSkip = Database['public']['Tables']['queue_skips']['Row']
export type FeaturedPurchase = Database['public']['Tables']['featured_purchases']['Row']

// Use the database type directly
export type Product = Database['public']['Tables']['products']['Row']

export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type WeekInsert = Database['public']['Tables']['weeks']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']
export type QueueSkipInsert = Database['public']['Tables']['queue_skips']['Insert']
export type FeaturedPurchaseInsert = Database['public']['Tables']['featured_purchases']['Insert']

export interface ProductWithVotes extends Product {
  votes: Vote[]
  vote_count: number
  user_vote?: Vote | null
  comments?: CommentWithUser[]
  comment_count?: number
  users?: {
    first_name: string | null
    last_name: string | null
    handle: string | null
  }
  is_featured?: boolean
}

export interface CommentWithUser extends Comment {
  users: {
    first_name: string | null
    last_name: string | null
    handle: string | null
    avatar_url: string | null
  }
}

export interface WeekWithProducts extends Week {
  products: ProductWithVotes[]
}

export interface ProductWithUser extends Product {
  user: User
}

// UserProfile is the same as User in our database
export type UserProfile = User 