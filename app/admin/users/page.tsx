"use client";
import { useEffect, useState, useCallback } from "react";
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
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Crown,
  Eye,
  EyeOff,
  Trash2,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  Key,
  Settings,
  RefreshCw,
} from "lucide-react";

type User = {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "Admin",
      isActive: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-09-27",
    },
    {
      id: "2",
      email: "sarah.wilson@example.com",
      firstName: "Sarah",
      lastName: "Wilson",
      role: "Moderator",
      isActive: true,
      createdAt: "2024-02-20",
      lastLogin: "2024-09-26",
    },
    {
      id: "3",
      email: "mike.johnson@example.com",
      firstName: "Mike",
      lastName: "Johnson",
      role: "SuperAdmin",
      isActive: false,
      createdAt: "2024-01-10",
      lastLogin: "2024-09-25",
    },
  ]);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "Moderator",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to load users");
      }
      // Filter users based on search query
      // const filteredUsers = users.filter(
      //   (user) =>
      //     user.email.toLowerCase().includes(q.toLowerCase()) ||
      //     `${user.firstName} ${user.lastName}`
      //       .toLowerCase()
      //       .includes(q.toLowerCase())
      // );
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, [q, users]);

  useEffect(() => {
    if (mounted) load();
  }, [load, mounted]);

  async function createUser(e: React.FormEvent) {
    setError(null);
    setLoading(true);

    try {
      // Mock user creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
      };

      //adding the api call
      e.preventDefault();
      setError(null);
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }

      // setUsers((prev) => [newUser, ...prev]);
      setCreating(false);
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        role: "Moderator",
        password: "",
      });
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(u: User) {
    setLoading(true);
    try {
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
        credentials: "include",
        body: JSON.stringify({ id: u._id || u.id, isActive: !u.isActive }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(u: User, role: string) {
    setLoading(true);
    try {
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
        credentials: "include",
        body: JSON.stringify({ id: u._id || u.id, role }),
      });
      if (res.status === 401)
        alert("Please re-authenticate for sensitive action.");
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function remove(u: User) {
    if (
      !confirm(`Are you sure you want to delete ${u.firstName} ${u.lastName}?`)
    )
      return;

    setLoading(true);
    try {
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      const res = await fetch(
        `/api/admin/users?id=${encodeURIComponent(u._id || u.id)}`,
        {
          method: "DELETE",
          headers: { "x-csrf-token": csrf },
          credentials: "include",
        }
      );
      if (res.status === 401) {
        alert("Please re-authenticate to delete.");
        reauth();
      }
      await load();
    } finally {
      setLoading(false);
    }
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case "SuperAdmin":
        return <Crown className="h-4 w-4" />;
      case "Admin":
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  }

  function getRoleBadgeColor(role: string) {
    switch (role) {
      case "SuperAdmin":
        return "from-amber-500 to-orange-500";
      case "Admin":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-emerald-500 to-teal-500";
    }
  }
  async function reauth() {
    const password = prompt("Re-enter your password for confirmation");
    if (!password) return;
    const res = await fetch("/api/auth/reauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (!res.ok) alert("Re-authentication failed");
  }

  if (!mounted) {
    return null;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(q.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(q.toLowerCase())
  );

  return (
    <div className="admin-users-page space-y-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage users, roles, and permissions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
              {filteredUsers.length} Users
            </Badge>
            <Button
              onClick={() => setCreating(!creating)}
              className={`${
                creating
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              {creating ? (
                <XCircle className="h-5 w-5 mr-2" />
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              {creating ? "Cancel" : "New User"}
            </Button>
          </div>
        </div>
      </div>

      {/* Create User Form */}
      {creating && (
        <Card
          className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl rounded-2xl overflow-hidden"
          style={{ animation: "slideDown 0.5s ease-out" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                Create New User
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="grid gap-6 md:grid-cols-2" onSubmit={createUser}>
              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="user@example.com"
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
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
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
                  special character.
                </p>
              </div>
              {error && (
                <div className="md:col-span-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}
              <div className="md:col-span-2 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreating(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createUser}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg px-6"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Create User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by email or name..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
              />
            </div>
            <Button
              onClick={load}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg px-6"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <Card
            key={index}
            className="group backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: mounted ? "fadeInUp 0.6s ease-out forwards" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50"></div>

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`bg-gradient-to-r ${
                    user.isActive
                      ? "from-emerald-500 to-teal-500"
                      : "from-red-500 to-pink-500"
                  } text-white border-0 text-xs`}
                >
                  {user.isActive ? (
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
                {/* Role Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`bg-gradient-to-r ${getRoleBadgeColor(
                      user.role
                    )} text-white border-0 flex items-center`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{user.role}</span>
                  </Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Joined {user.createdAt}
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Change Role
                  </Label>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(v) => changeRole(user, v)}
                  >
                    <SelectTrigger className="h-9 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-lg text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(user)}
                    className="flex-1 h-8 text-xs border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {user.isActive ? (
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
                    onClick={() => remove(user)}
                    className="h-8 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No Users Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search criteria or create a new user.
            </p>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        .admin-users-page {
          font-size: 1.6rem;
        }

        .admin-users-page * {
          font-size: inherit;
        }

        .admin-users-page .text-xs {
          font-size: 1.2rem;
        }
        .admin-users-page .text-sm {
          font-size: 1.4rem;
        }
        .admin-users-page .text-base {
          font-size: 1.6rem;
        }
        .admin-users-page .text-lg {
          font-size: 1.8rem;
        }
        .admin-users-page .text-xl {
          font-size: 2rem;
        }
        .admin-users-page .text-2xl {
          font-size: 2.4rem;
        }
        .admin-users-page .text-3xl {
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
