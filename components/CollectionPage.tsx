import React, { useState } from "react";
import {
  ShoppingCart,
  Star,
  Heart,
  Eye,
  Sparkles,
  Crown,
  Diamond,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types";

interface CollectionPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const CollectionPage = ({ products, onAddToCart }: CollectionPageProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const handleLike = (productId: string) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-48 h-48 bg-gradient-to-l from-purple-400/10 to-pink-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-br from-cyan-300/8 to-blue-400/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating particles */}
        {[12, 34, 56, 78, 23, 45, 67, 89, 15, 37, 59, 81].map((left, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            style={{
              left: `${left}%`,
              top: `${(i * 27) % 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: (i % 3) + 3,
              repeat: Infinity,
              delay: (i % 4) * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[164rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          {/* Decorative elements around header */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Crown size={32} className="text-amber-400 opacity-60" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-8xl font-black mb-6 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-2xl">
              Exquisite
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Collection
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={24} className="text-yellow-400" />
              </motion.div>
            </motion.span>

            {/* Glow effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 blur-2xl -z-10 rounded-2xl" />
          </motion.h1>

          <motion.div
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover our handcrafted jewelry pieces, each telling a unique story
            of elegance and sophistication
            {/* Subtle highlight effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent rounded-lg"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-8 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>

        {/* Enhanced Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="group relative overflow-hidden"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl opacity-0 blur-lg"
                  animate={{
                    opacity: hoveredProduct === product.id ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Enhanced shimmer overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{
                      x: hoveredProduct === product.id ? "100%" : "-100%",
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />

                  {/* Product Image Container */}
                  <div className="relative aspect-square overflow-hidden group">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />

                    {/* Image overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Floating action buttons */}
                    <motion.div
                      className="absolute top-4 right-4 flex flex-col gap-2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        scale: hoveredProduct === product.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        onClick={() => handleLike(product.id)}
                        className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
                          likedProducts.has(product.id)
                            ? "bg-red-500/80 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart
                          size={18}
                          fill={
                            likedProducts.has(product.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </motion.button>

                      <motion.button
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={18} />
                      </motion.button>
                    </motion.div>

                    {/* Stock indicator */}
                    {product.stock_quantity <= 5 &&
                      product.stock_quantity > 0 && (
                        <motion.div
                          className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Only {product.stock_quantity} left!
                        </motion.div>
                      )}

                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Product Info */}
                  <div className="p-6 relative">
                    {/* Rating Stars with animation */}
                    <motion.div
                      className="flex items-center mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Product Name with hover effect */}
                    <motion.h3
                      className="text-lg md:text-xl font-bold text-white mb-2 transition-all duration-300 relative"
                      whileHover={{ scale: 1.02 }}
                    >
                      {product.name}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                        layoutId={`name-bg-${product.id}`}
                      />
                    </motion.h3>

                    <p className="text-sm md:text-base text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and Cart Section */}
                    <div className="flex items-center justify-between">
                      <motion.span
                        className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                      >
                        ${product.price.toFixed(2)}
                      </motion.span>

                      <motion.button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-black px-4 py-2 rounded-xl font-bold hover:from-amber-400 hover:to-orange-500 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm md:text-base overflow-hidden"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 opacity-0 hover:opacity-30 transition-opacity rounded-xl" />

                        <ShoppingCart className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Add to Cart</span>
                      </motion.button>
                    </div>

                    {/* Decorative diamond icon */}
                    <motion.div
                      className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity"
                      animate={{
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Diamond size={20} className="text-amber-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 relative"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <Crown size={64} className="text-amber-400 opacity-60 mx-auto" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              No Products Available
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Our craftsmen are working on new exquisite pieces. Check back soon
              for the latest additions to our collection.
            </p>

            {/* Decorative elements */}
            <div className="flex justify-center gap-4 mt-8 opacity-40">
              <Sparkles size={20} className="text-amber-400" />
              <Diamond size={20} className="text-purple-400" />
              <Crown size={20} className="text-pink-400" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
