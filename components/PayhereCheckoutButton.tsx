"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

import { CheckoutRequest } from "@/types";
import { createPayment } from "@/utils/payhere";

interface PaymentRequestProps {
  checkout: CheckoutRequest;
  isProcessing: boolean;
  total: number;
  isValid: boolean;
  type?: "submit" | "button";
}

export default function PayHereCheckoutButton({
  checkout,
  isProcessing,
  total,
  isValid,
  type = "submit",
}: PaymentRequestProps) {
  // Validate required checkout fields
  const isBtnDisabled = useMemo(() => {
    // Use isValid prop if explicitly provided as false
    if (isValid === false) return true;

    // Check all required fields are filled
    const requiredFields = [
      checkout.first_name,
      checkout.last_name,
      checkout.email,
      checkout.phone,
      checkout.address,
      checkout.city,
      checkout.country,
      checkout.amount,
    ];

    return requiredFields.some(
      (field) => !field || (typeof field === "string" && !field.trim())
    );
  }, [
    checkout.first_name,
    checkout.last_name,
    checkout.email,
    checkout.phone,
    checkout.address,
    checkout.city,
    checkout.country,
    checkout.amount,
    isValid,
  ]);

  const handleCheckout = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent double submission
    if (isBtnDisabled || isProcessing) {
      e?.preventDefault();
      return;
    }

    // For submit buttons, let form handle submission
    // For regular buttons, trigger payment directly
    if (type === "button") {
      e?.preventDefault();
      await createPayment(checkout);
    }
    // If type is "submit", the form's onSubmit will handle the payment
  };

  return (
    <motion.button
      type={type}
      disabled={isBtnDisabled || isProcessing}
      className="w-full relative bg-gradient-to-r from-amber-500 to-orange-600 text-black py-5 rounded-2xl font-bold text-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl overflow-hidden"
      whileHover={
        !isBtnDisabled && !isProcessing ? { scale: 1.02, y: -2 } : undefined
      }
      whileTap={!isBtnDisabled && !isProcessing ? { scale: 0.98 } : undefined}
      onClick={handleCheckout}
      aria-busy={isProcessing}
      aria-label={
        isProcessing
          ? "Processing payment"
          : `Pay ${total.toFixed(2)} LKR with PayHere`
      }
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 hover:opacity-30 transition-opacity" />

      <span className="relative z-10 flex items-center justify-center gap-3">
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-6 h-6" />
            Pay with PayHere - LKR {total.toFixed(2)}
          </>
        )}
      </span>
    </motion.button>
  );
}
