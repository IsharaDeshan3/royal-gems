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

type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  loginCount: number;
};

type Permission = {
  name: string;
  description: string;
  roles: string[];
};

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    // Load current user role
    const profileRes = await fetch("/api/auth/profile", {
      credentials: "include",
    });
    const profile = await profileRes.json();
    setUserRole(profile.user?.role || "");

    // Load all users for role management
    const usersRes = await fetch("/api/admin/users", {
      credentials: "include",
    });
    const usersData = await usersRes.json();
    setUsers(usersData.users || []);

    // Load permissions (this would be from a config or database)
    setPermissions([
      {
        name: "user_management",
        description: "Create, update, delete users",
        roles: ["SuperAdmin", "Admin"],
      },
      {
        name: "product_management",
        description: "Manage gem listings and approvals",
        roles: ["SuperAdmin", "Admin", "Moderator"],
      },
      {
        name: "order_management",
        description: "View and manage orders",
        roles: ["SuperAdmin", "Admin"],
      },
      {
        name: "audit_logs",
        description: "View audit logs",
        roles: ["SuperAdmin", "Admin"],
      },
      {
        name: "system_settings",
        description: "Configure system settings",
        roles: ["SuperAdmin"],
      },
      {
        name: "financial_reports",
        description: "Access financial reports",
        roles: ["SuperAdmin", "Admin"],
      },
    ]);
    console.log(loading, userRole);

    setLoading(false);
  }

  async function updateUserRole(userId: string, newRole: string) {
    const csrf =
      document.cookie
        .split("; ")
        .find((r) => r.startsWith("csrfToken="))
        ?.split("=")[1] || "";
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      credentials: "include",
      body: JSON.stringify({ id: userId, role: newRole }),
    });

    if (res.status === 401) {
      alert("Please re-authenticate for role changes.");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update role");
      return;
    }

    await loadData();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-semibold">System Settings</h1>
        <Button variant="outline" onClick={reauth}>
          Re-authenticate
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Assign roles to users. Changes require re-authentication.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">User</th>
                    <th>Current Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-2">
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          variant={
                            user.role === "SuperAdmin"
                              ? "default"
                              : user.role === "Admin"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td>{user.isActive ? "Active" : "Suspended"}</td>
                      <td className="text-sm">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                        {user.loginCount > 0 && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({user.loginCount} logins)
                          </span>
                        )}
                      </td>
                      <td>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(v) => updateUserRole(user._id, v)}
                          disabled={user.email === "admin@royalgems.com"}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Moderator">Moderator</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="SuperAdmin">
                              SuperAdmin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Overview of permissions assigned to each role.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Permission</th>
                    <th>Description</th>
                    <th>Moderator</th>
                    <th>Admin</th>
                    <th>SuperAdmin</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm.name} className="border-b">
                      <td className="py-2 font-medium">
                        {perm.name.replace("_", " ")}
                      </td>
                      <td className="text-muted-foreground">
                        {perm.description}
                      </td>
                      <td>{perm.roles.includes("Moderator") ? "✓" : "✗"}</td>
                      <td>{perm.roles.includes("Admin") ? "✓" : "✗"}</td>
                      <td>{perm.roles.includes("SuperAdmin") ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="60" disabled />
                <p className="text-xs text-muted-foreground mt-1">
                  Currently fixed at 60 minutes
                </p>
              </div>
              <div>
                <Label>Failed Login Attempts</Label>
                <Input type="number" defaultValue="5" disabled />
                <p className="text-xs text-muted-foreground mt-1">
                  Account locks after 5 failed attempts
                </p>
              </div>
              <div>
                <Label>Password Requirements</Label>
                <div className="text-sm text-muted-foreground">
                  • Minimum 12 characters
                  <br />• Uppercase, lowercase, number, special character
                </div>
              </div>
              <div>
                <Label>2FA Required</Label>
                <div className="text-sm text-muted-foreground">
                  • Mandatory for Admin and SuperAdmin roles
                  <br />• Optional for Moderator role
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
