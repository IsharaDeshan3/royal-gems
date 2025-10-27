"use client";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Gem,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  role: string;
}

// Mock navigation for demonstration
const mockNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, active: true },
  { name: "Users", href: "/admin/users", icon: Users, active: false },
  {
    name: "Admins",
    href: "/admin/admins",
    icon: Shield,
    active: false,
    superAdminOnly: true,
  },
  { name: "Gems", href: "/admin/gems", icon: Gem, active: false },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, active: false },
  { name: "Logs", href: "/admin/logs", icon: FileText, active: false },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    active: false,
    superAdminOnly: true,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/profile", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        // If not on login page and not authenticated, redirect to login
        if (pathname !== "/admin/login") {
          router.push("/admin/login?reason=unauthenticated");
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function handleLogout() {
    setLoading(true);
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrfToken="))
      ?.split("=")[1];
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || "",
        },
        credentials: "include",
      });
      setUser(null);
      setLoading(false);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (!mounted) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200/30 border-t-indigo-400 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Loading Admin Portal
            </h3>
            <p className="text-indigo-200">Securing your session...</p>
          </div>
        </div>
      </div>
    );
  }

  // For login page, don't show sidebar
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-2">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-0 -left-8 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-bounce"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>
        <div className="relative z-10 w-full max-w-md lg:max-w-dvw transform scale-110">
          {children}
        </div>
      </div>
    );
  }

  // For authenticated users, show full layout with sidebar
  return (
    <div className="admin-layout min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-8 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Stunning Top Navigation Bar */}
        <header className="backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-b border-white/20 shadow-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Logo and user info */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Royal Gems Institute
                      </h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Admin Portal
                      </p>
                    </div>
                  </div>
                </div>

                {user && (
                  <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/60 dark:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.firstName}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 relative">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Stunning Sidebar */}
          <aside
            className={`
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            fixed lg:relative z-50 lg:z-auto
            w-72 h-full lg:h-auto
            backdrop-blur-md bg-white/80 dark:bg-slate-800/80 
            border-r border-white/20 shadow-2xl
            transition-transform duration-300 ease-in-out
            flex flex-col
          `}
          >
            <div className="p-6 flex-1">
              {/* User profile section */}
              {user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.firstName}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <Badge className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Navigation
                </p>
                {mockNavigation.map((item, index) => {
                  if (item.superAdminOnly && user?.role !== "SuperAdmin") {
                    return null;
                  }

                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`
                        group relative flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                        ${
                          item.active
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                            : "text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:scale-105"
                        }
                      `}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: mounted
                          ? "slideInLeft 0.5s ease-out forwards"
                          : "none",
                      }}
                    >
                      <Icon
                        className={`h-5 w-5 mr-3 ${
                          item.active
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        }`}
                      />
                      {item.name}
                      {item.active && (
                        <ChevronRight className="h-4 w-4 ml-auto text-white/70" />
                      )}

                      {/* Active indicator */}
                      {item.active && (
                        <div className="absolute right-2 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200/50 dark:border-slate-600/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                <p>© 2024 Royal Gems Institute</p>
                <p className="mt-1">Admin Portal v2.0</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        /* Reset font size for admin section to counteract global 62.5% */
        .admin-layout {
          font-size: 1.6rem; /* 16px when html is 62.5% */
        }

        .admin-layout * {
          font-size: inherit;
        }

        /* Ensure proper sizing for specific elements */
        .admin-layout h1 {
          font-size: 2.4rem;
        } /* 24px */
        .admin-layout h2 {
          font-size: 2rem;
        } /* 20px */
        .admin-layout h3 {
          font-size: 1.8rem;
        } /* 18px */
        .admin-layout .text-xs {
          font-size: 1.2rem;
        } /* 12px */
        .admin-layout .text-sm {
          font-size: 1.4rem;
        } /* 14px */
        .admin-layout .text-base {
          font-size: 1.6rem;
        } /* 16px */
        .admin-layout .text-lg {
          font-size: 1.8rem;
        } /* 18px */
        .admin-layout .text-xl {
          font-size: 2rem;
        } /* 20px */
        .admin-layout .text-2xl {
          font-size: 2.4rem;
        } /* 24px */
        .admin-layout .text-3xl {
          font-size: 3rem;
        } /* 30px */
        .admin-layout .text-4xl {
          font-size: 3.6rem;
        } /* 36px */

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
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
