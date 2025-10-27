import { BaseRepository, BaseRepositoryImpl } from './base'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface AuditLogRepository extends BaseRepository<AuditLog> {
  logAction(logData: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog>
  findByUserId(userId: string, limit?: number, offset?: number): Promise<AuditLog[]>
  findByEntity(entityType: string, entityId: string, limit?: number): Promise<AuditLog[]>
  findByAction(action: string, limit?: number, offset?: number): Promise<AuditLog[]>
  findByDateRange(startDate: string, endDate: string, limit?: number): Promise<AuditLog[]>
  getRecentActivity(limit?: number): Promise<AuditLog[]>
  getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]>
  searchLogs(query: string, limit?: number): Promise<AuditLog[]>
  logUserAction(userId: string, action: string, details?: {
    entityType?: string
    entityId?: string
    oldValues?: any
    newValues?: any
    ipAddress?: string
    userAgent?: string
  }): Promise<AuditLog>
  logAdminAction(adminId: string, action: string, targetEntity: {
    type: string
    id?: string
  }, details?: {
    oldValues?: any
    newValues?: any
    ipAddress?: string
    userAgent?: string
  }): Promise<AuditLog>
  logSystemAction(action: string, details?: {
    entityType?: string
    entityId?: string
    oldValues?: any
    newValues?: any
  }): Promise<AuditLog>
}

export class AuditLogRepositoryImpl extends BaseRepositoryImpl<AuditLog> implements AuditLogRepository {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'audit_logs')
  }

  async logAction(logData: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const { data, error } = await (this.supabase as any)
      .from('audit_logs')
      .insert(logData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as AuditLog
  }

  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  async findByEntity(entityType: string, entityId: string, limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  async findByAction(action: string, limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  async findByDateRange(startDate: string, endDate: string, limit: number = 100): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  async getRecentActivity(limit: number = 20): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.findByEntity(entityType, entityId, 1000) // Get all history for this entity
  }

  async searchLogs(query: string, limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .or(`action.ilike.%${query}%,entity_type.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []) as AuditLog[]
  }

  // Helper methods for common audit logging scenarios
  async logUserAction(userId: string, action: string, details?: {
    entityType?: string
    entityId?: string
    oldValues?: any
    newValues?: any
    ipAddress?: string
    userAgent?: string
  }): Promise<AuditLog> {
    return this.logAction({
      user_id: userId,
      action,
      entity_type: details?.entityType || 'user',
      entity_id: details?.entityId,
      old_values: details?.oldValues,
      new_values: details?.newValues,
      ip_address: details?.ipAddress,
      user_agent: details?.userAgent
    })
  }

  async logAdminAction(adminId: string, action: string, targetEntity: {
    type: string
    id?: string
  }, details?: {
    oldValues?: any
    newValues?: any
    ipAddress?: string
    userAgent?: string
  }): Promise<AuditLog> {
    return this.logAction({
      user_id: adminId,
      action: `admin_${action}`,
      entity_type: targetEntity.type,
      entity_id: targetEntity.id,
      old_values: details?.oldValues,
      new_values: details?.newValues,
      ip_address: details?.ipAddress,
      user_agent: details?.userAgent
    })
  }

  async logSystemAction(action: string, details?: {
    entityType?: string
    entityId?: string
    oldValues?: any
    newValues?: any
  }): Promise<AuditLog> {
    return this.logAction({
      action: `system_${action}`,
      entity_type: details?.entityType || 'system',
      entity_id: details?.entityId,
      old_values: details?.oldValues,
      new_values: details?.newValues
    })
  }
}