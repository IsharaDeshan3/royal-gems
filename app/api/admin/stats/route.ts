import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdminRole } from "@/lib/auth/middleware-helper";

// Cache for 30 seconds to reduce database load
export const revalidate = 30;

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !isAdminRole(user.role)) {
    return NextResponse.json(
      { error: error || "Forbidden" },
      { status: error ? 401 : 403 }
    );
  }

  try {
    // Get counts using direct Supabase queries
    const [usersResult, ordersResult, revenueResult, logsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').eq('payment_status', 'completed'),
      supabase.from('audit_logs').select('*', { count: 'exact', head: true })
        .ilike('action', '%LOGIN%')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    const users = usersResult.count || 0;
    const orders = ordersResult.count || 0;
    const logins = logsResult.count || 0;

    // Calculate total revenue from completed orders only
    const revenue = revenueResult.data?.reduce((sum, order) => {
      const amount = typeof order.total_amount === 'string' 
        ? parseFloat(order.total_amount) 
        : order.total_amount;
      return sum + (amount || 0);
    }, 0) || 0;

    return NextResponse.json({ users, orders, revenue, logins });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
