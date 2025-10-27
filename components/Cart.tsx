import React, { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Crown,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "../types";
import { useRouter } from "next/navigation";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onProceedToCheckout: () => void;
  onBackToCollection?: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onProceedToCheckout,
  onBackToCollection,
}) => {
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleRemove = (productId: string) => {
    setRemovingItems((prev) => new Set([...prev, productId]));
    setTimeout(() => {
      onRemove(productId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden ">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-l from-purple-400/10 to-pink-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 0.8, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated shopping bag icon */}
            <motion.div
              className="relative mb-8"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-2xl scale-150" />
              <ShoppingBag className="w-24 h-24 text-slate-400 mx-auto relative z-10" />

              {/* Floating sparkles around the bag */}
              {[0, 72, 144, 216, 288].map((rotation, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  style={{
                    top: `${50 + Math.sin((rotation * Math.PI) / 180) * 60}px`,
                    left: `${50 + Math.cos((rotation * Math.PI) / 180) * 60}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Your Cart is Empty
            </motion.h2>

            <motion.p
              className="text-lg text-slate-400 mb-12 max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Add some exquisite jewelry pieces to create your perfect
              collection
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.button
                onClick={() =>
                  onBackToCollection
                    ? onBackToCollection()
                    : router.push("/collection")
                }
                className="relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-500 transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 opacity-0 hover:opacity-30 transition-opacity" />
                <ArrowLeft className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Back to Collection</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden  lg:h-screen lg:snap-start flex items-center">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-amber-400/8 to-orange-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-l from-purple-400/8 to-pink-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.7, 1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          <motion.div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Crown size={24} className="text-amber-400 opacity-60" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-4">
            Shopping Cart
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full" />
        </motion.div>

        {/* Enhanced Cart Container */}
        <motion.div
          className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Subtle shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />

          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: removingItems.has(item.product.id) ? 0 : 1,
                  x: removingItems.has(item.product.id) ? 100 : 0,
                  scale: removingItems.has(item.product.id) ? 0.8 : 1,
                }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-8 relative ${
                  index > 0 ? "border-t border-white/10" : ""
                } group hover:bg-white/5 transition-all duration-300`}
              >
                {/* Product row glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center space-x-6 relative z-10">
                  {/* Enhanced Product Image */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-lg border-2 border-white/20 relative z-10"
                    />

                    {/* Floating heart icon */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart size={12} className="text-white fill-current" />
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Product Info */}
                  <div className="flex-1 space-y-2">
                    <motion.h3
                      className="text-xl md:text-2xl font-bold text-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.product.name}
                    </motion.h3>
                    <p className="text-base md:text-lg text-slate-300 line-clamp-1">
                      {item.product.description}
                    </p>
                    <motion.p
                      className="text-lg md:text-xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      ${item.product.price.toFixed(2)}
                    </motion.p>
                  </div>

                  {/* Enhanced Quantity Controls */}
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                    <motion.button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 border border-white/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </motion.button>

                    <span className="text-white font-bold text-xl w-8 text-center">
                      {item.quantity}
                    </span>

                    <motion.button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 border border-white/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>

                  {/* Enhanced Price and Remove */}
                  <div className="text-right space-y-3">
                    <motion.p
                      className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </motion.p>

                    <motion.button
                      onClick={() => handleRemove(item.product.id)}
                      className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 flex items-center justify-center transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Enhanced Total and Checkout Section */}
          <motion.div
            className="p-8 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-500/5" />

            {/* Floating sparkles */}
            <div className="absolute top-4 right-8">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={20} className="text-amber-400 opacity-60" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  Total:
                </span>
                <motion.span
                  className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ${total.toFixed(2)}
                </motion.span>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={onProceedToCheckout}
                  className="w-full relative bg-gradient-to-r from-amber-500 to-orange-600 text-black py-5 rounded-2xl font-bold text-xl md:text-2xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 shadow-2xl overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 hover:opacity-30 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Crown size={24} />
                    Proceed to Checkout
                  </span>
                </motion.button>

                <motion.button
                  onClick={() =>
                    onBackToCollection
                      ? onBackToCollection()
                      : router.push("/collection")
                  }
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-medium text-lg transition-all duration-300 flex items-center justify-center gap-3 border border-white/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <ArrowLeft size={20} />
                  Continue Shopping
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
