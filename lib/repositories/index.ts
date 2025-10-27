import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { UserRepository, UserRepositoryImpl } from './user'
import { GemRepository, GemRepositoryImpl } from './gem'
import { OrderRepository, OrderRepositoryImpl } from './order'
import { AuditLogRepository, AuditLogRepositoryImpl } from './audit-log'
import { PaymentRepository } from './PaymentRepository'

export interface RepositoryFactory {
  getUserRepository(): UserRepository
  getGemRepository(): GemRepository
  getOrderRepository(): OrderRepository
  getAuditLogRepository(): AuditLogRepository
  getPaymentRepository(): PaymentRepository
}

export class RepositoryFactoryImpl implements RepositoryFactory {
  private supabase: SupabaseClient<Database>

  // Repository instances (lazy-loaded)
  private userRepository?: UserRepository
  private gemRepository?: GemRepository
  private orderRepository?: OrderRepository
  private auditLogRepository?: AuditLogRepository
  private paymentRepository?: PaymentRepository

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }

  getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepositoryImpl(this.supabase)
    }
    return this.userRepository
  }

  getGemRepository(): GemRepository {
    if (!this.gemRepository) {
      this.gemRepository = new GemRepositoryImpl(this.supabase)
    }
    return this.gemRepository
  }

  getOrderRepository(): OrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new OrderRepositoryImpl(this.supabase)
    }
    return this.orderRepository
  }

  getAuditLogRepository(): AuditLogRepository {
    if (!this.auditLogRepository) {
      this.auditLogRepository = new AuditLogRepositoryImpl(this.supabase)
    }
    return this.auditLogRepository
  }

  getPaymentRepository(): PaymentRepository {
    if (!this.paymentRepository) {
      this.paymentRepository = new PaymentRepository(this.supabase as any)
    }
    return this.paymentRepository
  }
}

// Singleton instance for the application
let repositoryFactoryInstance: RepositoryFactory | null = null

export function getRepositoryFactory(supabase?: SupabaseClient<Database>): RepositoryFactory {
  if (!repositoryFactoryInstance) {
    if (!supabase) {
      throw new Error('Supabase client is required for the first repository factory initialization')
    }
    repositoryFactoryInstance = new RepositoryFactoryImpl(supabase)
  }
  return repositoryFactoryInstance
}

export function resetRepositoryFactory(): void {
  repositoryFactoryInstance = null
}

// Export types for convenience
export type { UserRepository, GemRepository, OrderRepository, AuditLogRepository }
export { UserRepositoryImpl, GemRepositoryImpl, OrderRepositoryImpl, AuditLogRepositoryImpl, PaymentRepository }