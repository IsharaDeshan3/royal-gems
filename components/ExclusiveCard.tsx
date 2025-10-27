"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export interface ExclusiveContent {
  id: number;
  title: string;
  image: string;
  description: string;
}

export default function ExclusiveCard(content: ExclusiveContent) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Box sx={{ maxWidth: 200, position: "relative" }}>
        {/* Glow effect background */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl opacity-0 blur-lg"
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating sparkles */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full pointer-events-none"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + Math.sin((i * 60 * Math.PI) / 180) * 80}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </>
        )}

        <Card
          variant="outlined"
          sx={{
            background:
              "linear-gradient(145deg, #BF8C93 0%, #d4a1a8 50%, #c9959c 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: isHovered
              ? "0 20px 40px rgba(191, 140, 147, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.3)"
              : "0 8px 20px rgba(191, 140, 147, 0.2)",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <CardContent sx={{ position: "relative", zIndex: 2 }}>
            {/* Title with enhanced styling */}
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-mono text-3xl font-bold text-white text-center py-4 drop-shadow-lg relative">
                {content.title || "Exclusive Item"}
                {/* Subtle glow behind text */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg blur-sm -z-10" />
              </h1>
            </motion.div>

            {/* Image container with enhanced effects */}
            <motion.div
              className="relative flex justify-center"
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotateY: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Image glow ring */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isHovered
                    ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 blur-md opacity-60 scale-110"
                    : "opacity-0"
                }`}
              />

              <div className="relative p-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <Image
                  src={content.image}
                  alt="card image"
                  width={100}
                  height={100}
                  className="rounded-full object-cover shadow-lg transition-all duration-300"
                  style={{
                    filter: isHovered
                      ? "brightness(1.1) saturate(1.2)"
                      : "brightness(1)",
                  }}
                />
              </div>

              {/* Sparkle icon overlay */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 180, 360],
                  scale: isHovered ? 1 : 0,
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.2 },
                }}
              >
                <Sparkles
                  size={16}
                  className="text-yellow-300 drop-shadow-lg"
                />
              </motion.div>
            </motion.div>

            {/* Description with fade effect */}
            <motion.p
              className="text-white/90 text-sm text-center mt-3 font-light leading-relaxed"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {content.description || "Discover something extraordinary"}
            </motion.p>
          </CardContent>

          <CardActions sx={{ pb: 2, position: "relative", zIndex: 2 }}>
            <div className="flex gap-2">
              {/* Add to cart button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  sx={{
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                    color: "#fff",
                    width: 48,
                    height: 48,
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </motion.div>

              {/* Like button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={() => setIsLiked(!isLiked)}
                  sx={{
                    background: isLiked
                      ? "linear-gradient(45deg, #e91e63 30%, #f06292 90%)"
                      : "linear-gradient(45deg, #666 30%, #888 90%)",
                    color: "#fff",
                    width: 48,
                    height: 48,
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: isLiked
                      ? "0 4px 15px rgba(233, 30, 99, 0.3)"
                      : "0 4px 15px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      background: isLiked
                        ? "linear-gradient(45deg, #d81b60 30%, #ec407a 90%)"
                        : "linear-gradient(45deg, #555 30%, #777 90%)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </IconButton>
              </motion.div>
            </div>
          </CardActions>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              width: isHovered ? "100%" : "0%",
            }}
            transition={{ duration: 0.4 }}
          />
        </Card>
      </Box>
    </motion.div>
  );
}
