"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
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
} from "lucide-react";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    <footer
      id="footer-container"
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden border-t border-white/10"
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
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Crown size={32} className="text-amber-400" />
                </motion.div>
                <div>
                  <h3 className="text-[1.05rem] font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                    Royal Gems
                  </h3>
                  <p className="text-[0.84rem] text-amber-400 font-medium">
                    Institute
                  </p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-3 text-xs">
                Sri Lanka&apos;s premier gemstone institute with 2000
                years of heritage.
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2">
                {["GIA", "SSEF", "Gübelin", "AIGS"].map((cert) => (
                  <div
                    key={cert}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-slate-300 text-xs border border-white/20"
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Collections */}
              <div>
                <h4 className="text-[0.84rem] font-bold text-white mb-2 flex items-center gap-2">
                  <Diamond size={14} className="text-purple-400" />
                  Collections
                </h4>
                <ul className="space-y-[0.84rem]">
                  {footerLinks.collections.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <Sparkles
                          size={10}
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
                <h4 className="text-[0.84rem] font-bold text-white mb-2 flex items-center gap-2">
                  <Gem size={14} className="text-emerald-400" />
                  Services
                </h4>
                <ul className="space-y-[0.84rem]">
                  {footerLinks.services.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <Sparkles
                          size={10}
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
                <h4 className="text-[0.84rem] font-bold text-white mb-2 flex items-center gap-2">
                  <Globe size={14} className="text-blue-400" />
                  Academy
                </h4>
                <ul className="space-y-[0.84rem]">
                  {footerLinks.academy.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <Sparkles
                          size={10}
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
                <h4 className="text-[0.84rem] font-bold text-white mb-2 flex items-center gap-2">
                  <Star size={14} className="text-yellow-400" />
                  Company
                </h4>
                <ul className="space-y-[0.84rem]">
                  {footerLinks.company.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <Sparkles
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400"
                        />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <h4 className="text-[0.84rem] font-bold text-white mb-2 flex items-center gap-2">
                <Award size={14} className="text-amber-400" />
                Contact
              </h4>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin
                    size={14}
                    className="text-amber-400 mt-1 flex-shrink-0"
                  />
                  <p className="text-[0.84rem] text-slate-300">
                    123 Galle Road, Colombo 03
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone
                    size={14}
                    className="text-amber-400 flex-shrink-0"
                  />
                  <p className="text-slate-300 text-xs">
                    +94 11 234 5678
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-amber-400 flex-shrink-0"
                  />
                  <p className="text-slate-300 text-xs">
                    info@royalgems.lk
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 ${social.color} transition-all border border-white/20`}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon size={12} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:from-amber-400 hover:to-orange-500 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={16} className="transform -rotate-45" />
      </motion.button>
    </footer>
  );
};

export default Footer;
