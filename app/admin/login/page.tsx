// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [twoFactorToken, setTwoFactorToken] = useState('');
//   const [requires2FA, setRequires2FA] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const reason = params.get('reason');
//     if (reason === 'session_expired') setError('Your session expired. Please log in again.');
//     if (reason === 'unauthenticated') setError('Please log in to continue.');
//     if (reason === 'token_invalid') setError('Your session is invalid. Please log in.');
//   }, [params]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const csrfToken = document.cookie
//         .split('; ')
//         .find((row) => row.startsWith('csrfToken='))?.split('=')[1];

//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-csrf-token': csrfToken || '',
//         },
//         body: JSON.stringify({ email, password, twoFactorToken: requires2FA ? twoFactorToken : undefined }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         router.push('/admin');
//         return;
//       }
//       if (data.requires2FA) {
//         setRequires2FA(true);
//         setError('Enter your 2FA code to continue.');
//       } else {
//         setError(data.error || 'Login failed.');
//       }
//     } catch {
//       setError('Unexpected error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Admin Login</CardTitle>
//           <CardDescription>Sign in to access the admin panel.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
//             </div>
//             {requires2FA && (
//               <div className="space-y-2">
//                 <Label htmlFor="twofactor">2FA Code</Label>
//                 <Input id="twofactor" inputMode="numeric" pattern="\\d{6}" maxLength={6} value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} />
//               </div>
//             )}
//             {error && <p className="text-sm text-red-600">{error}</p>}
//             <div className="flex items-center justify-center">
//               <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>

//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//the newly polished section
"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Crown,
  Mail,
  Key,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lock,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const reason = params.get("reason");
    if (reason === "session_expired")
      setError("Your session expired. Please log in again.");
    if (reason === "unauthenticated") setError("Please log in to continue.");
    if (reason === "token_invalid")
      setError("Your session is invalid. Please log in.");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrfToken="))
        ?.split("=")[1];

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || "",
        },
        body: JSON.stringify({
          email,
          password,
          twoFactorToken: requires2FA ? twoFactorToken : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        return;
      }
      if (data.requires2FA) {
        setRequires2FA(true);
        setError("Enter your 2FA code to continue.");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 border-2">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-8 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-bounce"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/5 w-1 h-1 bg-blue-400/50 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div
          className="text-center mb-8"
          style={{ animation: "fadeInDown 0.8s ease-out" }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-2xl mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Royal Gems Institute
          </h1>
          <p className="text-blue-200 text-lg">Admin Portal</p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Secure Access
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card
          className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl"
          style={{ animation: "slideUp 0.8s ease-out" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>

          <CardHeader className="relative z-10 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
              <User className="h-6 w-6 mr-2 text-indigo-400" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-blue-200 mt-2">
              Sign in to access the admin panel
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-white font-semibold flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-indigo-400 transition-all duration-300 pl-4 rounded-xl"
                    placeholder="admin@royalgems.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-white font-semibold flex items-center"
                >
                  <Key className="h-4 w-4 mr-2 text-indigo-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-indigo-400 transition-all duration-300 pl-4 pr-12 rounded-xl"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                </div>
              </div>

              {/* 2FA Field */}
              {requires2FA && (
                <div
                  className="space-y-3"
                  style={{ animation: "slideDown 0.5s ease-out" }}
                >
                  <Label
                    htmlFor="twofactor"
                    className="text-white font-semibold flex items-center"
                  >
                    <Shield className="h-4 w-4 mr-2 text-emerald-400" />
                    2FA Authentication Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="twofactor"
                      inputMode="numeric"
                      pattern="\\d{6}"
                      maxLength={6}
                      value={twoFactorToken}
                      onChange={(e) => setTwoFactorToken(e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300 pl-4 rounded-xl text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pointer-events-none"></div>
                  </div>
                  <p className="text-xs text-blue-200 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className="bg-red-500/20 border border-red-400/30 rounded-xl p-4"
                  style={{ animation: "shake 0.5s ease-in-out" }}
                >
                  <p className="text-red-200 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </div>
              )}

              {/* Success Hint for 2FA */}
              {requires2FA && !error && (
                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4">
                  <p className="text-emerald-200 text-sm flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                    Email and password verified. Please complete 2FA
                    authentication.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {requires2FA ? (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Verify & Sign In
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Sign In
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </div>
                )}
              </Button>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-xs text-blue-200">
                  Having trouble? Contact your system administrator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div
          className="text-center mt-8 text-blue-200/60 text-xs"
          style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
        >
          <p>© 2024 Royal Gems Institute. All rights reserved.</p>
          <p className="mt-1">Secure Admin Access Portal</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
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
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 200px;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
