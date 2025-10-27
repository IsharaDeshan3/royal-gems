"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  Eye,
} from "lucide-react";

// interface ApiAuditLog {
//   _id: string;
//   action: string;
//   adminEmail: string;
//   resource: string;
//   timestamp: string;
//   success: boolean;
// }

interface ActivityItem {
  id: string;
  action: string;
  adminEmail: string;
  resource: string;
  timestamp: string;
  success: boolean;
}

interface DashboardStats {
  users: number;
  orders: number;
  revenue: number;
  logins: number;
  recentActivity: ActivityItem[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 1247,
    orders: 832,
    revenue: 94750,
    logins: 156,
    recentActivity: [
      {
        id: "1",
        action: "CREATE_USER",
        adminEmail: "admin@example.com",
        resource: "users",
        timestamp: "2024-09-27 14:23:15",
        success: true,
      },
      {
        id: "2",
        action: "UPDATE_ORDER",
        adminEmail: "manager@example.com",
        resource: "orders",
        timestamp: "2024-09-27 14:18:32",
        success: true,
      },
      {
        id: "3",
        action: "DELETE_PRODUCT",
        adminEmail: "admin@example.com",
        resource: "products",
        timestamp: "2024-09-27 13:45:21",
        success: false,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Simulate API calls with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, this would fetch from APIs
      setStats((prev) => ({
        ...prev,
        users: Math.floor(Math.random() * 2000) + 1000,
        orders: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 50000) + 75000,
        logins: Math.floor(Math.random() * 200) + 100,
      }));
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!mounted) {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      description: "Active registered users",
      icon: Users,
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-50 to-purple-50",
      darkBgGradient: "from-blue-950 to-purple-950",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      description: "Orders this month",
      icon: ShoppingCart,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950 to-teal-950",
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.revenue),
      description: "Monthly revenue",
      icon: TrendingUp,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-950 to-red-950",
    },
    {
      title: "Recent Logins",
      value: stats.logins,
      description: "Last 24 hours",
      icon: Clock,
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      bgGradient: "from-violet-50 to-indigo-50",
      darkBgGradient: "from-violet-950 to-indigo-950",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-8 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 space-y-8 p-6 max-w-7xl mx-auto">
        {/* Floating Header */}
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Welcome back, let&apos;s see what&apos;s happening
                </p>
              </div>
            </div>
            <Button
              onClick={loadStats}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stunning Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`group relative overflow-hidden backdrop-blur-md bg-gradient-to-br ${card.bgGradient} dark:${card.darkBgGradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: mounted
                    ? "fadeInUp 0.8s ease-out forwards"
                    : "none",
                }}
              >
                <div className="absolute inset-0 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm"></div>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full transform rotate-45 scale-150`}
                  ></div>
                </div>

                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                    {card.title}
                  </CardTitle>
                  <div
                    className={`p-2 bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pb-6">
                  <div className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {typeof card.value === "string"
                      ? card.value
                      : card.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex items-center">
                    <Zap className="h-3 w-3 mr-1 opacity-70" />
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Recent Activity */}
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>

          <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Recent Activity
                </CardTitle>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md">
                Live
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 p-6">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group relative p-4 rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: mounted
                        ? "slideInLeft 0.8s ease-out forwards"
                        : "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Badge
                            variant={
                              activity.success ? "default" : "destructive"
                            }
                            className={`text-xs px-3 py-1 rounded-full font-semibold shadow-md ${
                              activity.success
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
                            }`}
                          >
                            {activity.action.replace("_", " ")}
                          </Badge>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 px-3 py-1 rounded-full">
                            {activity.adminEmail}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full">
                            {activity.resource}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.success ? "bg-emerald-400" : "bg-red-400"
                        } shadow-lg group-hover:scale-125 transition-transform duration-300`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
