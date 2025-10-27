import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface ITemDisplayCardProps {
  title?: string;
  image?: string;
  description?: string;
}

function ITemDisplayCard({ title, image, description }: ITemDisplayCardProps) {
  return (
    <motion.div
      className="relative overflow-visible p-8 flex flex-col items-center justify-center text-center group"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      }}
      style={{ perspective: "1000px" }}
    >
      {/* Animated background gradients */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-[3rem] blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full opacity-60 blur-lg"
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-500 rounded-full opacity-50 blur-md"
        animate={{
          y: [5, -15, 5],
          x: [3, -3, 3],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main card container */}
      <motion.div
        className="relative z-10 w-full max-w-sm bg-white/20 backdrop-blur-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] rounded-[2.5rem] border border-white/30 p-8 flex flex-col items-center overflow-hidden group-hover:shadow-[0_35px_80px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Shimmering overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />

        {/* Title with gradient text effect */}
        <motion.h1
          className="font-bold text-4xl md:text-5xl bg-gradient-to-br from-slate-800 via-slate-600 to-slate-900 bg-clip-text text-transparent drop-shadow-xl mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {title || "Spectacular Item"}
        </motion.h1>

        {/* Image container with fancy frame */}
        <motion.div
          className="relative mb-6 group/image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Glowing ring around image */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full opacity-0 group-hover/image:opacity-60 blur-lg transition-all duration-500" />

          {/* Image frame with multiple borders */}
          <div className="relative p-1 bg-gradient-to-br from-white/60 to-white/20 rounded-3xl shadow-2xl">
            <div className="p-1 bg-gradient-to-br from-slate-200/50 to-slate-300/30 rounded-[1.4rem]">
              <Image
                src={image || "/default-image.jpg"}
                alt="Item Image"
                width={240}
                height={240}
                className="rounded-3xl object-cover shadow-inner border-2 border-white/50 transition-all duration-500 group-hover/image:brightness-110"
                style={{ aspectRatio: "1/1" }}
              />
            </div>
          </div>

          {/* Floating particles around image */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover/image:opacity-80"
              style={{
                top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 120}px`,
                left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 120}px`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Description with typewriter effect styling */}
        <motion.div
          className="font-medium text-lg md:text-xl text-slate-700 leading-relaxed max-w-xs text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Subtle text glow background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-sm -z-10 rounded-lg"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <p className="relative z-10 m-0">
            {description ||
              "Experience the extraordinary with this remarkable creation."}
          </p>
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-6 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default ITemDisplayCard;
