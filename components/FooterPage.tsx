"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Crown,
  Diamond,
  Gem,
  Sparkles,
  Award,
  Globe,
  ArrowUp,
  Heart,
  Star,
  ChevronUp,
} from "lucide-react";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;

      // Expand footer when mouse is near bottom (within 80px)
      if (windowHeight - mouseY < 80) {
        setIsExpanded(true);
      }

      const rect = document
        .getElementById("footer-container")
        ?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    collections: [
      { name: "Engagement Rings", href: "/collections/engagement" },
      { name: "Wedding Bands", href: "/collections/wedding" },
      { name: "Necklaces", href: "/collections/necklaces" },
      { name: "Earrings", href: "/collections/earrings" },
      { name: "Bracelets", href: "/collections/bracelets" },
      { name: "Gemstones", href: "/collections/gemstones" },
    ],
    services: [
      { name: "Custom Design", href: "/services/custom-design" },
      { name: "Appraisal Services", href: "/services/appraisal" },
      { name: "Repair & Restoration", href: "/services/repair" },
      { name: "Certification", href: "/services/certification" },
      { name: "Consultation", href: "/services/consultation" },
      { name: "Investment Gems", href: "/services/investment" },
    ],
    academy: [
      { name: "Gemology Courses", href: "/academy/gemology" },
      { name: "Jewelry Design", href: "/academy/design" },
      { name: "Appraisal Training", href: "/academy/appraisal" },
      { name: "Online Learning", href: "/academy/online" },
      { name: "Certification Programs", href: "/academy/certification" },
      { name: "Workshops", href: "/academy/workshops" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Contact", href: "/contact" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/royalgemsinstitute",
      color: "hover:text-blue-400",
      name: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/royalgemsinstitute",
      color: "hover:text-pink-400",
      name: "Instagram",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/royalgems_lk",
      color: "hover:text-blue-300",
      name: "Twitter",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/royalgemsinstitute",
      color: "hover:text-red-400",
      name: "YouTube",
    },
  ];

  return (
    <motion.footer
      id="footer-container"
      style={{ y }}
      className="fixed bottom-0 left-0 right-0 z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          // Expanded Footer - Compact Height
          <motion.div
            key="expanded"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden"
          >
            {/* Interactive Mouse Spotlight */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, 
                  rgba(255, 215, 0, 0.06) 0%, 
                  rgba(255, 165, 0, 0.03) 25%, 
                  rgba(128, 0, 128, 0.02) 50%, 
                  transparent 70%)`,
              }}
            />

            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] bg-gradient-to-r from-amber-400/10 via-orange-500/8 to-red-500/6 rounded-full blur-3xl"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  x: [0, 50, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Main Footer Content - Condensed */}
              <div className="max-w-[140em] mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  {/* Company Info - Condensed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Crown size={36} className="text-amber-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                          Royal Gems
                        </h3>
                        <p className="text-amber-400 text-base font-medium">
                          Institute
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-4 text-base">
                      Sri Lanka&apos;s premier gemstone institute with 2000
                      years of heritage.
                    </p>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-2">
                      {["GIA", "SSEF", "Gübelin", "AIGS"].map((cert) => (
                        <div
                          key={cert}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-slate-300 text-sm border border-white/20"
                        >
                          {cert}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Navigation Links - Horizontal */}
                  <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Collections */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Diamond size={18} className="text-purple-400" />
                        Collections
                      </h4>
                      <ul className="space-y-2">
                        {footerLinks.collections.slice(0, 4).map((link) => (
                          <li key={link.name}>
                            <a
                              href={link.href}
                              className="text-slate-300 hover:text-amber-300 transition-colors text-base flex items-center gap-2 group"
                            >
                              <Sparkles
                                size={12}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400"
                              />
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Gem size={18} className="text-emerald-400" />
                        Services
                      </h4>
                      <ul className="space-y-2">
                        {footerLinks.services.slice(0, 4).map((link) => (
                          <li key={link.name}>
                            <a
                              href={link.href}
                              className="text-slate-300 hover:text-amber-300 transition-colors text-base flex items-center gap-2 group"
                            >
                              <Sparkles
                                size={12}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400"
                              />
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Academy */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Globe size={18} className="text-blue-400" />
                        Academy
                      </h4>
                      <ul className="space-y-2">
                        {footerLinks.academy.slice(0, 4).map((link) => (
                          <li key={link.name}>
                            <a
                              href={link.href}
                              className="text-slate-300 hover:text-amber-300 transition-colors text-base flex items-center gap-2 group"
                            >
                              <Sparkles
                                size={12}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400"
                              />
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Company */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Star size={18} className="text-yellow-400" />
                        Company
                      </h4>
                      <ul className="space-y-2">
                        {footerLinks.company.slice(0, 4).map((link) => (
                          <li key={link.name}>
                            <a
                              href={link.href}
                              className="text-slate-300 hover:text-amber-300 transition-colors text-base flex items-center gap-2 group"
                            >
                              <Sparkles
                                size={12}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400"
                              />
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Contact Info - Compact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-1"
                  >
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Award size={18} className="text-amber-400" />
                      Contact
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={16}
                          className="text-amber-400 mt-1 flex-shrink-0"
                        />
                        <p className="text-slate-300 text-sm">
                          123 Galle Road, Colombo 03
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone
                          size={16}
                          className="text-amber-400 flex-shrink-0"
                        />
                        <p className="text-slate-300 text-sm">
                          +94 11 234 5678
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail
                          size={16}
                          className="text-amber-400 flex-shrink-0"
                        />
                        <p className="text-slate-300 text-sm">
                          info@royalgems.lk
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-4">
                      {socialLinks.map((social, i) => (
                        <motion.a
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 ${social.color} transition-all border border-white/20`}
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <social.icon size={16} />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
                <div className="max-w-[140em] mx-auto px-8 py-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="text-slate-400 text-sm text-center md:text-left">
                      <p className="flex items-center gap-1">
                        © 2024 Royal Gems Institute • Crafted with{" "}
                        <Heart size={12} className="text-red-400" /> in Kynasoft
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <a
                        href="/privacy"
                        className="hover:text-amber-300 transition-colors"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="/terms"
                        className="hover:text-amber-300 transition-colors"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Collapsed Footer Bar
          <motion.div
            key="collapsed"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 border-t border-white/10 backdrop-blur-xl"
          >
            <div className="max-w-[140em] mx-auto px-8 py-3">
              <div className="flex items-center justify-between">
                {/* Left - Logo */}
                <div className="flex items-center gap-3">
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
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                      Royal Gems
                    </span>
                    <span className="text-sm text-amber-400 ml-2">
                      Institute
                    </span>
                  </div>
                </div>

                {/* Center - Quick Links */}
                <div className="hidden md:flex items-center gap-8 text-base text-slate-300">
                  <a
                    href="/about"
                    className="hover:text-amber-300 transition-colors font-medium"
                  >
                    About
                  </a>
                  <a
                    href="/collection"
                    className="hover:text-amber-300 transition-colors font-medium"
                  >
                    Collections
                  </a>
                  <a
                    href="/academy"
                    className="hover:text-amber-300 transition-colors font-medium"
                  >
                    Academy
                  </a>
                  <a
                    href="/contact"
                    className="hover:text-amber-300 transition-colors font-medium"
                  >
                    Contact
                  </a>
                </div>

                {/* Right - Social & Expand Hint */}
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex items-center gap-3">
                    {socialLinks.map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 ${social.color} transition-all border border-white/20`}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <social.icon size={16} />
                      </motion.a>
                    ))}
                  </div>

                  <motion.div
                    className="flex items-center gap-2 text-slate-400 text-sm font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronUp size={16} />
                    <span className="hidden sm:inline">Hover to expand</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-24 left-8 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-full flex items-center justify-center shadow-2xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 z-50"
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <ArrowUp size={22} />
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
