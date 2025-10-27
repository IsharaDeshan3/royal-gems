import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Shield,
  Check,
  Crown,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { CartItem, BillingDetails, Order, OrderItem } from "../types";
import { createOrder } from "@/utils/api";
import PayHereCheckoutButton from "./PayhereCheckoutButton";
import { createPayment } from "@/utils/payhere";
import { toast } from "sonner";

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onOrderComplete }) => {
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [completedFields, setCompletedFields] = useState<Set<string>>(
    new Set()
  );

  //make items ==>> orderItem interface arry to proecss order
  const orderItems: OrderItem[] = useMemo(() => {
    items.map((item) => console.log("Product items is", item.product));
    return items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      products: item.product,
    }));
  }, [items]);

  // Calculate total
  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  // Validate form
  const isFormValid = useMemo(() => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
    } = billingDetails;
    return !!(
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phone.trim() &&
      address.trim() &&
      city.trim() &&
      postalCode.trim() &&
      country.trim()
    );
  }, [billingDetails]);

  // Create PayHere checkout object
  const checkout = useMemo(
    () => ({
      order_id: "ORDER-" + Date.now(),
      items: items
        .map((item) => `${item.product.name} x${item.quantity}`)
        .join(", "),
      amount: total,
      currency: "LKR",
      first_name: billingDetails.firstName,
      last_name: billingDetails.lastName,
      email: billingDetails.email,
      phone: billingDetails.phone,
      address: billingDetails.address,
      city: billingDetails.city,
      country: billingDetails.country,
    }),
    [billingDetails, items, total]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));

    // Mark field as completed if it has value
    if (value.trim()) {
      setCompletedFields((prev) => new Set([...prev, name]));
    } else {
      setCompletedFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(name);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isProcessing) return;

    setIsProcessing(true);

    try {
      // Create order in database
      const orderData: Order = {
        total_amount: total,
        orderId: checkout.order_id.toString(),
        status: "pending",
        billing_details: billingDetails,
        payment_status: "pending",
        order_items: orderItems,
      };

      const createdOrder = createOrder(orderData);

      console.log("Order set to", createdOrder);
      // Create order items

      setTimeout(() => {
        toast.success("Order has been placed, redirecting to payment...");
      }, 2000);
      if ((await createdOrder)._id && checkout) {
        const res = await createPayment(checkout);
        console.log("Payment response ", res);
      }

      // Trigger PayHere payment (this should be handled by createPayment in utils)
      // After successful payment callback from PayHere:

      // alert("Payment successful! Order has been placed.");
      onOrderComplete();
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Failed to process order. Please try again.");
      setIsProcessing(false);
    }
  };

  const getFieldIcon = (fieldName: string) => {
    const iconMap = {
      firstName: User,
      lastName: User,
      email: Mail,
      phone: Phone,
      address: MapPin,
      city: MapPin,
      postalCode: MapPin,
      country: Globe,
    };
    return iconMap[fieldName as keyof typeof iconMap] || User;
  };

  const renderInputField = (
    field: string,
    label: string,
    type: string = "text",
    placeholder: string = ""
  ) => {
    const IconComponent = getFieldIcon(field);

    return (
      <motion.div
        key={field}
        className="relative"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <label className="block text-base font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <IconComponent size={16} className="text-amber-400" />
          {label} *
        </label>
        <div className="relative">
          <input
            type={type}
            name={field}
            value={billingDetails[field as keyof BillingDetails] as string}
            onChange={handleInputChange}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            required
            className={`w-full bg-white/10 border-2 rounded-xl px-4 py-3 text-base text-white placeholder-white/40 focus:outline-none transition-all duration-300 ${
              focusedField === field
                ? "border-amber-400 bg-white/15"
                : completedFields.has(field)
                ? "border-green-400/50"
                : "border-white/20 hover:border-white/30"
            }`}
            placeholder={placeholder}
          />

          <AnimatePresence>
            {completedFields.has(field) && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Check size={16} className="text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-amber-400/8 to-orange-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-l from-purple-400/8 to-pink-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[15, 35, 55, 75, 25, 45, 65, 85].map((left, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            style={{
              left: `${left}%`,
              top: `${(i * 25) % 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: (i % 2) + 3,
              repeat: Infinity,
              delay: (i % 3) * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Crown size={28} className="text-amber-400 opacity-60" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-4">
            Secure Checkout
          </h1>

          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-lg">256-bit SSL Encrypted</span>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Billing Form */}
          <motion.div
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <User className="w-8 h-8 text-amber-400" />
                Billing Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("firstName", "First Name", "text", "John")}
                  {renderInputField("lastName", "Last Name", "text", "Doe")}
                </div>

                {/* Email and Phone */}
                {renderInputField(
                  "email",
                  "Email Address",
                  "email",
                  "john@example.com"
                )}
                {renderInputField(
                  "phone",
                  "Phone Number",
                  "tel",
                  "+94 77 123 4567"
                )}

                {/* Address */}
                {renderInputField(
                  "address",
                  "Street Address",
                  "text",
                  "123 Main Street"
                )}

                {/* City, Postal Code, Country */}
                <div className="grid grid-cols-3 gap-4">
                  {renderInputField("city", "City", "text", "Colombo")}
                  {renderInputField(
                    "postalCode",
                    "Postal Code",
                    "text",
                    "10100"
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-base font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Globe size={16} className="text-amber-400" />
                      Country *
                    </label>
                    <select
                      name="country"
                      value={billingDetails.country}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border-2 border-white/20 hover:border-white/30 focus:border-amber-400 rounded-xl px-4 py-3 text-base text-white focus:outline-none transition-all duration-300"
                    >
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="India">India</option>
                      <option value="Maldives">Maldives</option>
                    </select>
                  </motion.div>
                </div>

                {/* Submit Button */}
                <PayHereCheckoutButton
                  type="submit"
                  checkout={checkout}
                  isProcessing={isProcessing}
                  isValid={isFormValid}
                  total={total}
                />

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>
                    Your payment information is secured with SSL encryption
                  </span>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Enhanced Order Summary */}
          <motion.div
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden h-fit"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Background decoration */}
            <div className="absolute top-6 right-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sparkles size={24} className="text-amber-400 opacity-40" />
              </motion.div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-8 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-amber-400" />
              Order Summary
            </h2>

            <div className="space-y-6">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-lg border-2 border-white/20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      </motion.div>

                      <div>
                        <p className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                          {item.product.name}
                        </p>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                          <span>Qty: {item.quantity}</span>
                          <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                          <span>LKR {item.product.price.toFixed(2)} each</span>
                        </p>
                      </div>
                    </div>

                    <motion.p
                      className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                    >
                      LKR {(item.product.price * item.quantity).toFixed(2)}
                    </motion.p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Total Section */}
            <div className="border-t border-white/20 mt-8 pt-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Shipping:</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Tax:</span>
                  <span>Included</span>
                </div>
              </div>

              <motion.div
                className="flex items-center justify-between text-2xl md:text-3xl border-t border-white/20 pt-6 mt-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-bold text-white">Total:</span>
                <span className="font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  LKR {total.toFixed(2)}
                </span>
              </motion.div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                Accepted Payment Methods:
              </h3>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg text-xs font-medium">
                  PayHere
                </div>
                <div className="px-3 py-1 bg-green-600/20 text-green-300 rounded-lg text-xs font-medium">
                  Visa
                </div>
                <div className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-xs font-medium">
                  Mastercard
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
