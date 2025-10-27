import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export interface BaseRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(limit?: number, offset?: number): Promise<T[]>
  create(data: any): Promise<T>
  update(id: string, data: any): Promise<T | null>
  delete(id: string): Promise<boolean>
  count(): Promise<number>
}

export abstract class BaseRepositoryImpl<T> implements BaseRepository<T> {
  protected supabase: SupabaseClient<Database>
  protected tableName: string

  constructor(supabase: SupabaseClient<Database>, tableName: string) {
    this.supabase = supabase
    this.tableName = tableName
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return data as T
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as T[]
  }

  async create(data: any): Promise<T> {
    const { data: result, error } = await (this.supabase as any)
      .from(this.tableName)
      .insert(data)
      .select()
      .single()

    if (error) {
      throw error
    }

    return result as T
  }

  async update(id: string, data: any): Promise<T | null> {
    const { data: result, error } = await (this.supabase as any)
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw error
    }

    return result as T
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return true
  }

  async count(): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw error
    }

    return count || 0
  }
}