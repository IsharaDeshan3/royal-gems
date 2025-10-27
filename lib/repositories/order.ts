import { BaseRepository, BaseRepositoryImpl } from './base'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address?: any // jsonb in database
  billing_address?: any // jsonb in database
  payment_method?: string
  payment_status?: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  gem_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface OrderRepository extends BaseRepository<Order> {
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Order[]>
  findByStatus(status: string, limit?: number, offset?: number): Promise<Order[]>
  updateStatus(id: string, status: Order['status']): Promise<Order | null>
  updateTrackingNumber(id: string, trackingNumber: string): Promise<Order | null>
  updatePaymentStatus(id: string, paymentStatus: string): Promise<Order | null>
  getOrderWithItems(orderId: string): Promise<OrderWithItems | null>
  getUserOrderHistory(userId: string, limit?: number, offset?: number): Promise<OrderWithItems[]>
  getTotalRevenue(): Promise<number>
  getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]>
  cancelOrder(id: string): Promise<Order | null>
  getOrderStatistics(): Promise<{
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    completedOrders: number
  }>
  createOrderWithItems(orderData: Partial<Order>, items: Array<{
    gem_id: string
    quantity: number
    unit_price: number
    total_price: number
  }>): Promise<OrderWithItems>
}

export class OrderRepositoryImpl extends BaseRepositoryImpl<Order> implements OrderRepository {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'orders')
  }

  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as Order[]
  }

  async findByStatus(status: string, limit: number = 50, offset: number = 0): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as Order[]
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const { data, error } = await (this.supabase as any)
      .from('orders')
      .update({
        status,
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

    return data as Order
  }

  async updateTrackingNumber(id: string, trackingNumber: string): Promise<Order | null> {
    const { data, error } = await (this.supabase as any)
      .from('orders')
      .update({
        tracking_number: trackingNumber,
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

    return data as Order
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order | null> {
    const { data, error } = await (this.supabase as any)
      .from('orders')
      .update({
        payment_status: paymentStatus,
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

    return data as Order
  }

  async getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
    // Get order
    const order = await this.findById(orderId)
    if (!order) return null

    // Get order items
    const { data: items, error } = await this.supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (error) {
      throw error
    }

    return {
      ...order,
      items: (items || []) as OrderItem[]
    }
  }

  async getUserOrderHistory(userId: string, limit: number = 50, offset: number = 0): Promise<OrderWithItems[]> {
    // Get user's orders
    const orders = await this.findByUserId(userId, limit, offset)

    // Get all order IDs
    const orderIds = orders.map(order => order.id)

    if (orderIds.length === 0) {
      return []
    }

    // Get all order items for these orders
    const { data: allItems, error } = await this.supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)

    if (error) {
      throw error
    }

    // Group items by order_id
    const itemsByOrder = (allItems || []).reduce((acc: Record<string, OrderItem[]>, item: any) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = []
      }
      acc[item.order_id].push(item as OrderItem)
      return acc
    }, {})

    // Combine orders with their items
    return orders.map(order => ({
      ...order,
      items: itemsByOrder[order.id] || []
    }))
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    if (error) {
      throw error
    }

    return (data as any[] || []).reduce((sum, order) => sum + (order.total_amount || 0), 0)
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []) as Order[]
  }

  async cancelOrder(id: string): Promise<Order | null> {
    return this.updateStatus(id, 'cancelled')
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    completedOrders: number
  }> {
    // Get total orders count
    const totalOrders = await this.count()

    // Get total revenue
    const totalRevenue = await this.getTotalRevenue()

    // Get pending orders count
    const pendingOrders = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get completed orders count (delivered orders)
    const completedOrders = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'delivered')

    return {
      totalOrders,
      totalRevenue,
      pendingOrders: (pendingOrders as any).count || 0,
      completedOrders: (completedOrders as any).count || 0
    }
  }

  // Additional methods for order items
  async createOrderWithItems(orderData: Partial<Order>, items: Array<{
    gem_id: string
    quantity: number
    unit_price: number
    total_price: number
  }>): Promise<OrderWithItems> {
    // Calculate total amount if not provided
    if (!orderData.total_amount) {
      orderData.total_amount = items.reduce((sum, item) => sum + item.total_price, 0)
    }

    // Create order first
    const order = await this.create(orderData)

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      gem_id: item.gem_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }))

    const { data: createdItems, error } = await (this.supabase as any)
      .from('order_items')
      .insert(orderItems)
      .select()

    if (error) {
      // If items creation fails, we should ideally rollback the order
      // But Supabase doesn't support transactions across tables in this way
      // In production, you'd want to handle this more robustly
      console.error('Failed to create order items:', error)
      throw error
    }

    return {
      ...order,
      items: createdItems as OrderItem[]
    }
  }

  async createOrderItem(item: {
    order_id: string
    gem_id: string
    quantity: number
    unit_price: number
    total_price: number
  }): Promise<OrderItem> {
    const { data, error } = await (this.supabase as any)
      .from('order_items')
      .insert(item)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as OrderItem
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (error) {
      throw error
    }

    return (data || []) as OrderItem[]
  }
}