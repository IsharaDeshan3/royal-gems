"use client";

import { motion } from "framer-motion";
import { XCircle, Home, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-300/20 to-orange-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-20">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.5)]"
              >
                <XCircle className="w-16 h-16 text-white" strokeWidth={3} />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-red-200 to-orange-300 bg-clip-text text-transparent mb-4">
                Payment Cancelled
              </h1>

              <p className="text-xl text-slate-200 max-w-md mx-auto">
                Your payment was cancelled. No charges were made.
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  What happened?
                </h2>
                <p className="text-slate-300 mb-4">
                  You cancelled the payment process. Your order has not been
                  placed and no payment was processed.
                </p>
                <p className="text-slate-300">
                  If you encountered any issues or have questions, please
                  contact our support team.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/collection"
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-4 px-6 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft size={20} />
                  <span>Try Again</span>
                </Link>

                <Link
                  href="/collection"
                  className="group flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag size={20} />
                  <span>Browse Gems</span>
                </Link>

                <Link
                  href="/"
                  className="group flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
              </div>

              {/* Support Section */}
              <div className="mt-8 text-center">
                <p className="text-slate-300 text-sm mb-2">
                  Need help? Contact our support team
                </p>
                <a
                  href="mailto:support@royalgems.com"
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  support@royalgems.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
