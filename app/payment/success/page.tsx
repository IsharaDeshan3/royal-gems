"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Package,
  Home,
  ShoppingBag,
  ArrowRight,
  Diamond,
  Star,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PaymentVerification } from "@/types";
import { verifyPayment } from "@/utils/payhere";
import Link from "next/link";

function PaymentSuccessContent() {
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [verification, setVerification] =
    useState<PaymentVerification | null>();

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setShowConfetti(false), 5000);
    const orderId = searchParams.get("order_id");
    fetchVerification(orderId);
    if (orderId) {
      console.log("order Id provided", orderId);
    } else {
      setError("No order ID provided");
      setLoading(true);
    }
  }, [searchParams]);

  const fetchVerification = async (orderId: string | null) => {
    if (!orderId) {
      return;
    }
    try {
      const res = await verifyPayment(orderId);
      const { status, amount, created_at, currency, orderId: verifiedOrderId } = res;
      setVerification({ 
        orderId: verifiedOrderId || orderId, 
        status, 
        createdAt: created_at, 
        amount, 
        currency 
      });
      console.log("Payment Verification:", res);
    } catch (error) {
      console.error("Failed to verify payment:", error);
      setError("Failed to verify payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Verifying payment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Floating background elements - matching website theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -25, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-300/15 to-blue-400/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Particle system */}
      <div className="absolute inset-0 pointer-events-none">
        {[10, 25, 40, 60, 75, 20, 85, 35, 55, 70, 15, 45, 80, 30, 65, 50].map(
          (left, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              style={{
                left: `${left}%`,
                top: `${(i * 37) % 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: (i % 3) + 2,
                repeat: Infinity,
                delay: (i % 4) * 0.5,
                ease: "easeInOut",
              }}
            />
          )
        )}
      </div>

      {/* Success confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
              }}
              animate={{
                y: ["0vh", "110vh"],
                rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
            >
              {i % 3 === 0 ? (
                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
              ) : i % 3 === 1 ? (
                <Diamond
                  className="w-3 h-3 text-purple-400"
                  fill="currentColor"
                />
              ) : (
                <Sparkles className="w-3 h-3 text-pink-400" />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-20">
        <div className="max-w-4xl w-full">
          {/* Main Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Success Header with Crown */}
            <div className="relative bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 p-12 text-center overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-[2px] h-[200%] bg-gradient-to-b from-amber-400 via-orange-400 to-red-400 rotate-45 shadow-[0_0_20px_#fbbf24]"
                initial={{ x: -150, opacity: 0.1 }}
                animate={{ x: 150, opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-24 h-24 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-60" />
                  <Crown
                    size={96}
                    className="relative z-10 text-amber-400 mx-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                >
                  <CheckCircle2
                    className="w-16 h-16 text-white"
                    strokeWidth={3}
                  />
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-4">
                  Payment Successful!
                </h1>

                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full" />

                <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto">
                  Thank you for your precious purchase from Royal Gems Institute
                </p>
              </motion.div>
            </div>

            {/* Order Details */}
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-2xl border border-white/10 p-6 md:p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Package className="mr-3 text-amber-400" size={28} />
                  Order Confirmed
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Order Number</p>
                    <p className="text-white text-lg font-bold">
                      {verification?.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Order Date</p>
                    <p className="text-white text-lg font-bold">
                      {new Date(
                        verification?.createdAt ? verification.createdAt : ""
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      Payment Method
                    </p>
                    <p className="text-white text-lg font-bold">PayHere</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {verification?.currency} {verification?.amount}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3">
                  <CheckCircle2
                    className="text-emerald-400 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    {verification?.status == "pending" && (
                      <div>
                        <p className="text-yellow-300 text-sm font-semibold mb-1">
                          Payment Validating
                        </p>
                        <p className="text-slate-300 text-xs">
                          Your payment has been securely processed and under
                          vaildation
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Link
                  href="/orders"
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-4 px-6 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  <Package size={20} />
                  <span>Track Order</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/collection"
                  className="group flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag size={20} />
                  <span>Continue Shopping</span>
                </Link>

                <Link
                  href="/"
                  className="group flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Home size={20} />
                  <span>Back to Home</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center mt-8 text-slate-300"
          >
            <p className="text-sm">
              Questions about your order? Contact us at{" "}
              <a
                href="mailto:support@royalgems.com"
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                support@royalgems.com
              </a>
            </p>
            <p className="text-xs mt-2 text-slate-400">
              © 2024 Royal Gems Institute. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
