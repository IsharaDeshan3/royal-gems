// Simplified Supabase types for the migration
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          first_name: string
          last_name: string
          role: 'SuperAdmin' | 'Admin' | 'Moderator' | 'User'
          is_active: boolean
          two_factor_secret: string | null
          two_factor_enabled: boolean
          password_reset_token: string | null
          password_reset_expires: string | null
          last_login: string | null
          login_attempts: number
          lock_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          first_name: string
          last_name: string
          role?: 'SuperAdmin' | 'Admin' | 'Moderator' | 'User'
          is_active?: boolean
          two_factor_secret?: string | null
          two_factor_enabled?: boolean
          password_reset_token?: string | null
          password_reset_expires?: string | null
          last_login?: string | null
          login_attempts?: number
          lock_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          first_name?: string
          last_name?: string
          role?: 'SuperAdmin' | 'Admin' | 'Moderator' | 'User'
          is_active?: boolean
          two_factor_secret?: string | null
          two_factor_enabled?: boolean
          password_reset_token?: string | null
          password_reset_expires?: string | null
          last_login?: string | null
          login_attempts?: number
          lock_until?: string | null
          updated_at?: string
        }
      }
      gems: {
        Row: {
          id: string
          name: string
          description: string
          category: 'Diamond' | 'Ruby' | 'Sapphire' | 'Emerald' | 'Pearl' | 'Other'
          price: number
          images: string[]
          specifications: Json
          is_active: boolean
          seller_id: string | null
          approved_by: string | null
          approval_status: 'Pending' | 'Approved' | 'Rejected'
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'Diamond' | 'Ruby' | 'Sapphire' | 'Emerald' | 'Pearl' | 'Other'
          price: number
          images: string[]
          specifications?: Json
          is_active?: boolean
          seller_id?: string | null
          approved_by?: string | null
          approval_status?: 'Pending' | 'Approved' | 'Rejected'
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: 'Diamond' | 'Ruby' | 'Sapphire' | 'Emerald' | 'Pearl' | 'Other'
          price?: number
          images?: string[]
          specifications?: Json
          is_active?: boolean
          seller_id?: string | null
          approved_by?: string | null
          approval_status?: 'Pending' | 'Approved' | 'Rejected'
          stock?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          billing_details: Json
          payment_status: 'pending' | 'completed' | 'failed'
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          billing_details: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          billing_details?: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          product_details: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          product_details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          product_details?: Json
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string
          changes: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id: string
          changes?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string
          changes?: Record<string, any>
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