import { BaseRepository, BaseRepositoryImpl } from './base'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export interface Gem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  carat_weight?: number
  color?: string
  clarity?: string
  cut?: string
  origin?: string
  certification?: string
  images?: string[]
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GemFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  color?: string
  clarity?: string
  cut?: string
  origin?: string
  isActive?: boolean
}

export interface GemRepository extends BaseRepository<Gem> {
  findByCategory(category: string, limit?: number): Promise<Gem[]>
  searchGems(query: string, limit?: number): Promise<Gem[]>
  findActiveGems(limit?: number, offset?: number): Promise<Gem[]>
  findGemsWithFilters(filters: GemFilters, limit?: number, offset?: number): Promise<Gem[]>
  updateStock(id: string, quantity: number): Promise<Gem | null>
  decreaseStock(id: string, quantity: number): Promise<Gem | null>
  increaseStock(id: string, quantity: number): Promise<Gem | null>
  activateGem(id: string): Promise<Gem | null>
  deactivateGem(id: string): Promise<Gem | null>
  getLowStockGems(threshold: number): Promise<Gem[]>
  getCategories(): Promise<string[]>
  getPriceRange(): Promise<{ min: number; max: number }>
  bulkUpdateStock(updates: Array<{ id: string; quantity: number }>): Promise<Gem[]>
  getGemsByIds(ids: string[]): Promise<Gem[]>
}

export class GemRepositoryImpl extends BaseRepositoryImpl<Gem> implements GemRepository {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'gems')
  }

  async findByCategory(category: string, limit: number = 50): Promise<Gem[]> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }

  async searchGems(query: string, limit: number = 50): Promise<Gem[]> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }

  async findActiveGems(limit: number = 50, offset: number = 0): Promise<Gem[]> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }

  async findGemsWithFilters(filters: GemFilters, limit: number = 50, offset: number = 0): Promise<Gem[]> {
    let query = this.supabase
      .from('gems')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.color) {
      query = query.eq('color', filters.color)
    }
    if (filters.clarity) {
      query = query.eq('clarity', filters.clarity)
    }
    if (filters.cut) {
      query = query.eq('cut', filters.cut)
    }
    if (filters.origin) {
      query = query.eq('origin', filters.origin)
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    const { data, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }

  async updateStock(id: string, quantity: number): Promise<Gem | null> {
    const { data, error } = await (this.supabase as any)
      .from('gems')
      .update({
        stock_quantity: quantity,
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

    return data as Gem
  }

  async decreaseStock(id: string, quantity: number): Promise<Gem | null> {
    // First get current stock
    const gem = await this.findById(id)
    if (!gem) return null

    const newQuantity = Math.max(0, gem.stock_quantity - quantity)

    return this.updateStock(id, newQuantity)
  }

  async increaseStock(id: string, quantity: number): Promise<Gem | null> {
    // First get current stock
    const gem = await this.findById(id)
    if (!gem) return null

    const newQuantity = gem.stock_quantity + quantity

    return this.updateStock(id, newQuantity)
  }

  async activateGem(id: string): Promise<Gem | null> {
    const { data, error } = await (this.supabase as any)
      .from('gems')
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

    return data as Gem
  }

  async deactivateGem(id: string): Promise<Gem | null> {
    const { data, error } = await (this.supabase as any)
      .from('gems')
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

    return data as Gem
  }

  async getLowStockGems(threshold: number): Promise<Gem[]> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('*')
      .eq('is_active', true)
      .lte('stock_quantity', threshold)
      .order('stock_quantity', { ascending: true })

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }

  async getCategories(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      throw error
    }

    // Extract unique categories
    const categories = [...new Set((data as any[] || []).map((item: any) => item.category).filter(Boolean))]
    return categories as string[]
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    const { data, error } = await this.supabase
      .from('gems')
      .select('price')
      .eq('is_active', true)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return { min: 0, max: 0 }
    }

    const prices = (data as any[]).map((item: any) => item.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  async bulkUpdateStock(updates: Array<{ id: string; quantity: number }>): Promise<Gem[]> {
    const results: Gem[] = []

    // Update each gem individually (Supabase doesn't support bulk updates with different values easily)
    for (const update of updates) {
      const gem = await this.updateStock(update.id, update.quantity)
      if (gem) {
        results.push(gem)
      }
    }

    return results
  }

  async getGemsByIds(ids: string[]): Promise<Gem[]> {
    if (ids.length === 0) {
      return []
    }

    const { data, error } = await this.supabase
      .from('gems')
      .select('*')
      .in('id', ids)

    if (error) {
      throw error
    }

    return (data || []) as Gem[]
  }
}