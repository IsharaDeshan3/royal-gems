"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  Crown,
  Plus,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  UserPlus,
  Mail,
  User,
  Key,
  Settings,
  RefreshCw,
  Lock,
  Calendar,
} from "lucide-react";

type AdminUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "Admin",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/admins", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      } else {
        console.error("Failed to load admins");
        setAdmins([]);
      }
    } catch (err) {
      console.error("Failed to load admins:", err);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }

  async function createAdmin() {
    setError(null);
    setLoading(true);

    try {
      // Mock admin creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAdmin: AdminUser = {
        _id: Date.now().toString(),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setAdmins((prev) => [newAdmin, ...prev]);
      setCreating(false);
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        role: "Admin",
        password: "",
      });
    } catch (error) {
      setError("Failed to create admin account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(admin: AdminUser) {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdmins((prev) =>
        prev.map((a) =>
          a._id === admin._id ? { ...a, isActive: !a.isActive } : a
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(admin: AdminUser, role: string) {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdmins((prev) =>
        prev.map((a) => (a._id === admin._id ? { ...a, role } : a))
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeAdmin(admin: AdminUser) {
    if (!confirm(`Remove ${admin.firstName} ${admin.lastName}?`)) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
    } finally {
      setLoading(false);
    }
  }

  async function reauth() {
    const password = prompt("Re-enter your password for confirmation");
    if (!password) return;

    // Mock re-authentication
    alert("Re-authentication successful");
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case "Admin":
        return <ShieldCheck className="h-4 w-4" />;
      case "SuperAdmin":
        return <Crown className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  }

  function getRoleBadgeColor(role: string) {
    switch (role) {
      case "Admin":
        return "from-blue-500 to-indigo-500";
      case "SuperAdmin":
        return "from-amber-500 to-orange-500";
      default:
        return "from-emerald-500 to-teal-500";
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-admins-page space-y-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Admin Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage Admin and Moderator accounts
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                SuperAdmin creation is restricted to scripts only
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
              {admins.length} Admins
            </Badge>
            <Button
              variant="outline"
              onClick={reauth}
              className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Lock className="h-4 w-4 mr-2" />
              Re-authenticate
            </Button>
            <Button
              onClick={() => setCreating(!creating)}
              className={`${
                creating
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              {creating ? (
                <XCircle className="h-5 w-5 mr-2" />
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              {creating ? "Cancel" : "Add Admin"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-600 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Create Admin Form */}
      {creating && (
        <Card
          className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl rounded-2xl overflow-hidden"
          style={{ animation: "slideDown 0.5s ease-out" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                Create Admin or Moderator Account
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="admin@royalgems.com"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 mr-2" />
                  First Name
                </Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 mr-2" />
                  Last Name
                </Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Role
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v })}
                >
                  <SelectTrigger className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Key className="h-4 w-4 mr-2" />
                  Temporary Password
                </Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="Enter secure password"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Minimum 12 characters with uppercase, lowercase, number, and
                  special character
                </p>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCreating(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAdmin}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-lg px-6"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Create Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scr-y">
        {admins.map((admin, index) => (
          <Card
            key={admin._id}
            className="group backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: mounted ? "fadeInUp 0.6s ease-out forwards" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-700/50"></div>

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {admin.firstName.charAt(0)}
                    {admin.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {admin.email}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`bg-gradient-to-r ${
                    admin.isActive
                      ? "from-emerald-500 to-teal-500"
                      : "from-red-500 to-pink-500"
                  } text-white border-0 text-xs`}
                >
                  {admin.isActive ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Suspended
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 pt-0">
              <div className="space-y-4">
                {/* Role Badge & Created Date */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`bg-gradient-to-r ${getRoleBadgeColor(
                      admin.role
                    )} text-white border-0 flex items-center`}
                  >
                    {getRoleIcon(admin.role)}
                    <span className="ml-1">{admin.role}</span>
                  </Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Change Role
                  </Label>
                  <Select
                    defaultValue={admin.role}
                    onValueChange={(v) => changeRole(admin, v)}
                  >
                    <SelectTrigger className="h-9 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-lg text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(admin)}
                    className="flex-1 h-8 text-xs border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    disabled={loading}
                  >
                    {admin.isActive ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeAdmin(admin)}
                    className="h-8 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0"
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && admins.length === 0 && (
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Loading Admins
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Please wait while we fetch admin accounts...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && admins.length === 0 && (
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No Admin Accounts Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Create your first admin or moderator account to get started.
            </p>
            <Button
              onClick={() => setCreating(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Admin
            </Button>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        .admin-admins-page {
          font-size: 1.6rem;
        }

        .admin-admins-page * {
          font-size: inherit;
        }

        .admin-admins-page .text-xs {
          font-size: 1.2rem;
        }
        .admin-admins-page .text-sm {
          font-size: 1.4rem;
        }
        .admin-admins-page .text-base {
          font-size: 1.6rem;
        }
        .admin-admins-page .text-lg {
          font-size: 1.8rem;
        }
        .admin-admins-page .text-xl {
          font-size: 2rem;
        }
        .admin-admins-page .text-2xl {
          font-size: 2.4rem;
        }
        .admin-admins-page .text-3xl {
          font-size: 3rem;
        }

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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
