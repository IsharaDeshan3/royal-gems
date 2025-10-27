import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdminRole } from "@/lib/auth/middleware-helper";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await getAuthenticatedUser(request);
  if (error || !user || !isAdminRole(user.role)) {
    return NextResponse.json(
      { error: error || "Forbidden" },
      { status: error ? 401 : 403 }
    );
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
