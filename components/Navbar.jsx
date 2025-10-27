"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sparkles, Diamond, Crown } from "lucide-react";

function Navbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Don't render navbar on admin routes
  if (isAdminRoute) {
    return null;
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto collapse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Navigation items with icons
  const navItems = [
    { name: "Home", href: "/", icon: <Crown size={16} /> },
    { name: "Products", href: "/collection", icon: <Diamond size={16} /> },
    { name: "Academy", href: "/academy", icon: <Sparkles size={16} /> },
    { name: "About", href: "/about", icon: <Crown size={16} /> },
  ];

  const shouldShowCompact = isCollapsed && !isHovered && !isOpen;

  return (
    <div className="relative">
      {/* Navbar Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-2xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-l from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 30, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {shouldShowCompact ? (
          // Compact Mode
          <div className="py-3 relative z-10">
            <div className="max-w-[168em] mx-auto px-4 sm:px-8 md:px-16 lg:px-32 flex items-center justify-between">
              {/* Compact Logo - Left Side */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Crown size={28} className="text-amber-400" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                    Royal Gems
                  </span>
                  <span className="text-sm font-medium text-amber-400">
                    Institute
                  </span>
                </div>
              </motion.div>

              {/* Compact Navigation - Right Side */}
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center space-x-4">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="relative group"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 relative px-3 py-2 rounded-lg"
                      >
                        <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                          {item.icon}
                        </span>
                        <span className="whitespace-nowrap font-medium text-sm">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile menu button */}
                <motion.button
                  className="md:hidden flex items-center justify-center w-10 h-10 text-white bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                  onClick={() => setIsOpen(!isOpen)}
                  whileTap={{ scale: 0.95 }}
                >
                  {isOpen ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          // Full Mode
          <>
            {/* Logo Section */}
            <motion.div
              className="text-center py-4 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 className="font-sans font-title-max flex flex-col items-center justify-center relative">
                <motion.span
                  className="text-2xl md:text-7xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Royal
                </motion.span>

                <motion.div
                  className="my-2 relative"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                >
                  <svg
                    width="325"
                    height="8"
                    viewBox="0 0 325 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3/4 md:w-[325px] drop-shadow-lg"
                  >
                    <defs>
                      <linearGradient
                        id="goldGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#FFE100" />
                        <stop offset="50%" stopColor="#FFA500" />
                        <stop offset="100%" stopColor="#FFE100" />
                      </linearGradient>
                    </defs>
                    <rect
                      width="325"
                      height="8"
                      fill="url(#goldGradient)"
                      rx="4"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-amber-400/50 blur-sm rounded-full" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                <motion.span
                  className="text-xl md:text-5xl font-bold bg-gradient-to-r from-slate-200 via-white to-amber-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Gems Institute
                </motion.span>

                <motion.div
                  className="absolute -top-2 -right-4"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={16} className="text-amber-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-4"
                  animate={{ rotate: [360, 0], scale: [1, 0.8, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <Diamond size={14} className="text-purple-300" />
                </motion.div>
              </motion.h1>
            </motion.div>

            {/* Navigation Bar */}
            <div className="max-w-[168em] mx-auto px-4 sm:px-8 md:px-16 lg:px-32 py-4 flex items-center justify-between md:justify-center relative z-10">
              <nav className="hidden md:flex space-x-8 font-nav">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="relative group"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 relative px-3 py-2 rounded-lg"
                    >
                      <motion.div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="relative flex items-center gap-2 px-0.5">
                        <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                          {item.icon}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                          {item.name}
                        </span>
                      </div>
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.button
                className="md:hidden flex items-center justify-center w-10 h-10 text-white bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 pb-4 space-y-1 font-nav">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-white/90 hover:text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic Spacer */}
      <div
        className="transition-all duration-500"
        style={{
          paddingTop: shouldShowCompact
            ? scrolled
              ? "3.5rem"
              : "4rem"
            : scrolled
            ? "5rem"
            : "8rem",
        }}
      />
    </div>
  );
}

export default Navbar;
