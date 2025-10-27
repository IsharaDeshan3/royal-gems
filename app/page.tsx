"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Crown, Diamond } from "lucide-react";
import { motion } from "framer-motion";
import { ExclusiveContent } from "@/components/ExclusiveCard";
import ITemDisplayCard from "@/components/ITemDisplayCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Page() {
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent[]>([
    {
      id: 1,
      title: "Omnix",
      description: "Awesome work",
      image: "/ring-1.png",
    },
    {
      id: 2,
      title: "Gemify",
      description: "Brilliant design",
      image: "/ring-1.png",
    },
    {
      id: 3,
      title: "Sparkle",
      description: "Shiny creation",
      image: "/ring-1.png",
    },
  ]);
  const router = useRouter();

  const exploreBtnHandler = () => {
    toast.success("Navigating to Collection Page!", { duration: 1500 });
    setTimeout(() => {
      router.push("/collection");
    }, 1500);
  };

  const academyBtnHandler = () => {
    toast.success("Navigating to Academy Page !", { duration: 1500 });
    setTimeout(() => {
      router.push("/academy");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated geometric shapes */}
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

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar relative z-10">
        {/* ===================== SECTION 1 ===================== */}
        <section className="min-h-screen relative overflow-hidden py-20 lg:snap-start pt-[16em]">
          {/* Particle system with fixed positions */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              10, 25, 40, 60, 75, 20, 85, 35, 55, 70, 15, 45, 80, 30, 65, 50,
              90, 5, 72, 28,
            ].map((left, i) => (
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
            ))}
          </div>

          <div className="max-w-[168em] mx-auto px-4">
            <section className="flex flex-col md:flex-row w-full gap-8">
              {/* Left Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative w-full md:w-3/5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-[600px] flex flex-col justify-between px-8 py-20 overflow-hidden rounded-3xl"
              >
                {/* Enhanced Background Lines */}
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

                <div className="max-w-5xl relative z-10">
                  {/* Enhanced accent bar */}
                  <motion.div
                    className="relative mb-4"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-[110px] h-[6px] bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 shadow-[0_0_20px_#fbbf24] rounded-full" />
                  </motion.div>

                  {/* Enhanced title */}
                  <motion.h1
                    className="font-black py-10 text-4xl md:text-6xl bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Master the art of{" "}
                    <motion.span className="relative bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                      gemology
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-lg -z-10 rounded-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.span>
                  </motion.h1>
                </div>

                {/* Model image */}
                <motion.div
                  className="absolute bottom-0 right-0 w-3/4 md:w-[500px] h-auto"
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 10, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl rounded-full scale-110" />
                  <Image
                    src="/gem_girl_1.png"
                    alt="model-gem"
                    width={600}
                    height={600}
                    className="w-full h-auto relative z-10 drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="w-full md:w-2/5 flex flex-col justify-between relative"
              >
                {/* Premium Heritage Card */}
                <motion.div
                  className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden relative mb-8"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative p-8 text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 mx-auto mb-6 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-60" />
                      <Crown
                        size={64}
                        className="relative z-10 text-amber-400 mx-auto"
                      />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-4">
                      Royal Gems Institute
                    </h2>

                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full" />

                    <p className="text-2xl text-slate-200 leading-relaxed max-w-lg mx-auto mb-8">
                      Discover the ancient secrets of Sri Lankan gemstones,
                      where every stone tells a story of heritage,
                      craftsmanship, and timeless beauty.
                    </p>

                    {/* Premium Statistics */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { number: "2500+", label: "Precious Gems" },
                        { number: "50+", label: "Years Heritage" },
                        { number: "15K+", label: "Happy Clients" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            {stat.number}
                          </div>
                          <div className="text-sm text-slate-300 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        onClick={() => exploreBtnHandler()}
                        className="flex-1 relative bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 overflow-hidden group border border-slate-600/50"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Diamond size={20} />
                          Explore Gems
                        </span>
                      </motion.button>

                      <motion.button
                        className="flex-1 relative bg-gradient-to-r from-amber-500 to-orange-600 text-black px-6 py-4 rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-500 transition-all duration-300 overflow-hidden group"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => academyBtnHandler()}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles size={20} />
                          Academy
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Collections */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Featured Collections
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {exclusiveContent.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="relative group"
                    >
                      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl overflow-hidden">
                        <div className="relative z-10 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                            <Diamond size={24} className="text-white" />
                          </div>
                          <h4 className="text-white font-bold text-sm mb-1">
                            {card.title}
                          </h4>
                          <p className="text-slate-300 text-xs">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
          </div>
        </section>

        {/* ===================== HERITAGE SECTION ===================== */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative lg:h-screen lg:snap-start flex items-center">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-6">
                Treasures of Ceylon
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                For over 2000 years, Sri Lanka has been the world&apos;s premier
                source of the finest sapphires, rubies, and precious gemstones.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: Crown,
                  title: "Royal Heritage",
                  description:
                    "Gems that have adorned crowns and kingdoms for millennia",
                  highlight: "2000+ Years",
                },
                {
                  icon: Diamond,
                  title: "World's Finest",
                  description:
                    "Home to the legendary Star of India and Blue Belle of Asia",
                  highlight: "Legendary Stones",
                },
                {
                  icon: Diamond,
                  title: "Certified Authentic",
                  description:
                    "Every gem certified by international gemological institutes",
                  highlight: "100% Genuine",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group-hover:bg-white/10 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon size={32} className="text-white" />
                    </div>

                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                      {item.highlight}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== SHOP SECTION ===================== */}
        <motion.section
          className="py-32 relative"
          id="shop-section"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" />

          <section className="relative py-20 z-10 lg:h-screen lg:snap-start flex items-center">
            <div className="max-w-[168em] mx-auto flex flex-col lg:flex-row items-center gap-16 px-4 md:px-10">
              {/* Left: Hero & Intro */}
              <motion.div
                className="w-full lg:w-1/2 flex flex-col items-start justify-center mb-12 lg:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Shop Exquisite Jewellery
                  </h2>
                </div>

                <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
                  Discover our curated collection of rings, necklaces, and
                  earrings—each piece crafted to perfection for your most
                  unforgettable moments.
                </p>

                <motion.button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-500 transition-all duration-300 flex items-center gap-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    exploreBtnHandler();
                  }}
                >
                  <Sparkles size={20} />
                  Explore Full Collection
                </motion.button>
              </motion.div>

              {/* Right: Product Grid */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ITemDisplayCard
                  title="Omnix"
                  image="/item-image.png"
                  description="A beautiful gemstone necklace."
                />
                <ITemDisplayCard
                  title="Lunaria"
                  image="/item-image.png"
                  description="Elegant earrings for special occasions."
                />
              </div>
            </div>
          </section>
        </motion.section>
      </div>
    </div>
  );
}

export default Page;
