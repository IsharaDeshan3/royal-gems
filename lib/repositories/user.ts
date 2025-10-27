import { BaseRepository, BaseRepositoryImpl } from './base'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export interface User {
  id: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'SuperAdmin' | 'Admin' | 'Moderator' | 'User'
  is_active: boolean
  two_factor_secret?: string
  two_factor_enabled: boolean
  password_reset_token?: string
  password_reset_expires?: string
  last_login?: string
  login_attempts: number
  lock_until?: string
  created_at: string
  updated_at: string
}

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>
  findByRole(role: string): Promise<User[]>
  updatePassword(id: string, passwordHash: string): Promise<User | null>
  updateLastLogin(id: string): Promise<User | null>
  deactivateUser(id: string): Promise<User | null>
  activateUser(id: string): Promise<User | null>
  updateProfile(id: string, profile: Partial<User>): Promise<User | null>
  searchUsers(query: string, limit?: number): Promise<User[]>
  enableTwoFactor(id: string, secret: string): Promise<User | null>
  disableTwoFactor(id: string): Promise<User | null>
  updateTwoFactorSecret(id: string, secret: string): Promise<User | null>
}

export class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'users')
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async findByRole(role: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []) as User[]
  }

  async updatePassword(id: string, passwordHash: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        password: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async updateLastLogin(id: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async deactivateUser(id: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async activateUser(id: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async updateProfile(id: string, profile: Partial<User>): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as User[]
  }

  async enableTwoFactor(id: string, secret: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        two_factor_enabled: true,
        two_factor_secret: secret,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async disableTwoFactor(id: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        two_factor_enabled: false,
        two_factor_secret: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }

  async updateTwoFactorSecret(id: string, secret: string): Promise<User | null> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .update({
        two_factor_secret: secret,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as User
  }
}