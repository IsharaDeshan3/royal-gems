import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { getRepositoryFactory } from "@/lib/repositories";
import { supabase } from "@/lib/supabase";

const userRepository = getRepositoryFactory(supabase).getUserRepository();
const orderRepository = getRepositoryFactory(supabase).getOrderRepository();
const auditLogRepository = getRepositoryFactory(supabase).getAuditLogRepository();

export async function GET(request: NextRequest) {
  const authUser = await authService.getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has admin role
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['superadmin', 'admin', 'moderator'].includes(userProfile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get counts using direct Supabase queries since repositories don't have count methods yet
    const [usersResult, ordersResult, revenueResult, loginsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
      supabase.from('audit_logs').select('*', { count: 'exact', head: true })
        .eq('action', 'LOGIN')
        .eq('success', true)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    const users = usersResult.count || 0;
    const orders = ordersResult.count || 0;
    const logins = loginsResult.count || 0;

    // Calculate total revenue
    const revenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    return NextResponse.json({ users, orders, revenue, logins });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
