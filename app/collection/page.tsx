"use client";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { motion, AnimatePresence } from "framer-motion";

import { ShoppingCart, Sparkles, Crown, Diamond, Star } from "lucide-react";
import CollectionPage from "@/components/CollectionPage";
import { CartItem, Product, Order } from "../../types";
import Cart from "@/components/Cart";
import { dummyProducts } from "@/lib/data";
import Checkout from "@/components/Checkout";
import { getProducts } from "@/utils/api";

function Page() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("collection");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  // const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    if (data) setProducts(data);
    else setProducts(dummyProducts); // Fallback to dummy data
  };

  // the function to cart
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-48 h-48 bg-gradient-to-l from-purple-400/15 to-pink-500/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.7, 1],
            x: [0, -50, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-br from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Fixed position particles */}
        {[
          8, 24, 42, 67, 85, 15, 38, 55, 72, 91, 28, 48, 63, 79, 12, 31, 58, 76,
          89, 6,
        ].map((left, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            style={{
              left: `${left}%`,
              top: `${(i * 29) % 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: (i % 3) + 4,
              repeat: Infinity,
              delay: (i % 5) * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar relative z-10">
        {/* Enhanced Hero Section */}
        <section className="max-w-[164em] mx-auto flex items-center flex-col min-h-screen py-2  snap-start relative pt-40">
          {/* Floating shopping cart */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => {
                setCurrentPage("cart");
                const section = document.getElementById(
                  "exquisite-collection-section"
                );
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-2xl blur opacity-0 hover:opacity-100 transition-opacity" />
              <ShoppingCart className="w-8 h-8 relative z-10" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full relative"
          >
            <motion.h1
              className="font-sans font-black text-4xl md:text-6xl lg:text-8xl text-center relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
                The Royal Gems
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent relative"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Collection
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-6 -left-8"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Crown size={32} className="text-amber-400 opacity-70" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-6"
                  animate={{
                    rotate: [360, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Diamond size={24} className="text-purple-300 opacity-70" />
                </motion.div>
              </motion.span>

              {/* Glow effect behind title */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 blur-3xl -z-10 rounded-3xl" />
            </motion.h1>
          </motion.div>

          {/* Enhanced Featured Section */}
          <div className="flex w-full flex-col md:flex-row md:justify-between gap-10 mt-20 px-5">
            {/* Enhanced Left Side */}
            <motion.div
              className="py-10 md:w-1/2 flex flex-col justify-center items-center text-center gap-5 relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {/* Decorative sparkles */}
              <motion.div
                className="absolute top-0 left-10"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sparkles size={20} className="text-amber-400 opacity-60" />
              </motion.div>

              <motion.h1
                className="font-sans font-bold text-3xl md:text-4xl lg:text-6xl bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                This Month&apos;s Highlight
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-transparent blur-lg -z-10 rounded-lg"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="space-y-6"
              >
                <p className="font-mono text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed">
                  Introducing our most celebrated piece — a masterpiece of
                  craftsmanship and heritage. Designed with precision, ethically
                  sourced gemstones, and a timeless aesthetic.
                </p>
                <p className="font-mono text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed">
                  Available for a limited time, this exclusive design embodies
                  the artistry and authenticity of the Royal Gems Institute.
                  Don&apos;t miss the chance to own a true collector&apos;s
                  piece.
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center py-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-60" />
                  <Button
                    sx={{
                      background:
                        "linear-gradient(45deg, #6b46c1 30%, #8b5cf6 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #9f7aea 30%, #a78bfa 90%)",
                      },
                      fontSize: { xs: "1.2rem", md: "1.8rem" },
                      padding: { xs: "12px 32px", md: "16px 48px" },
                      fontWeight: 700,
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(107, 70, 193, 0.4)",
                      position: "relative",
                      zIndex: 10,
                    }}
                    variant="contained"
                    startIcon={<Crown />}
                  >
                    Own This Masterpiece
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Right Side - Featured Product */}
            <motion.div
              className="flex justify-center items-center md:w-1/2 relative"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl scale-110" />

              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden">
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating elements around image */}
                {[20, 40, 60, 80].map((rotation, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    style={{
                      top: `${
                        30 + Math.sin((rotation * Math.PI) / 180) * 150
                      }px`,
                      left: `${
                        30 + Math.cos((rotation * Math.PI) / 180) * 150
                      }px`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                  />
                ))}

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src="/lions-heart-necklace.png"
                    alt="featured"
                    width={500}
                    height={500}
                    className="rounded-2xl drop-shadow-2xl relative z-10"
                  />

                  {/* Product info overlay */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      Lion&apos;s Heart Necklace
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Limited Edition Masterpiece
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-amber-400 font-bold text-xl">
                        $2,999
                      </span>
                      <motion.button
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-3 py-1 rounded-lg text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Collections Section */}
        <section
          className="min-h-screen snap-start relative lg:h-screen pt-40"
          id="collections-section"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentPage === "collection" && (
                <motion.section
                  key="collection"
                  id="exquisite-collection-section"
                  className="min-h-screen snap-start"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6 }}
                >
                  <CollectionPage products={products} onAddToCart={addToCart} />
                </motion.section>
              )}

              {currentPage === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Cart
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onProceedToCheckout={() => setCurrentPage("checkout")}
                    onBackToCollection={() => setCurrentPage("collection")}
                  />
                </motion.div>
              )}

              {currentPage === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* fetch order function may needed */}
                  <Checkout
                    items={cartItems}
                    onOrderComplete={() => {
                      clearCart();
                      setCurrentPage("collection");
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pb-[400px]"></div>
        </section>
      </div>
    </div>
  );
}

export default Page;
