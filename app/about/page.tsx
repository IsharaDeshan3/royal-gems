"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Diamond,
  Award,
  Users,
  Globe,
  BookOpen,
  Shield,
  Sparkles,
  Heart,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { number: "2000+", label: "Years of Heritage", icon: Crown },
    { number: "50,000+", label: "Certified Gemstones", icon: Diamond },
    { number: "10,000+", label: "Happy Clients", icon: Users },
    { number: "500+", label: "Graduates Trained", icon: BookOpen },
  ];

  const values = [
    {
      icon: Shield,
      title: "Authenticity",
      description:
        "Every gemstone is certified and guaranteed authentic with full documentation",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "World-class standards in gemology, education, and customer service",
      color: "from-amber-400 to-orange-400",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "Transparent pricing, honest assessments, and ethical sourcing practices",
      color: "from-red-400 to-pink-400",
    },
    {
      icon: Globe,
      title: "Innovation",
      description:
        "Blending ancient wisdom with modern technology and teaching methods",
      color: "from-purple-400 to-indigo-400",
    },
  ];

  const milestones = [
    {
      year: "1924",
      event: "Founded in Colombo",
      detail: "Established as a family gem trading business",
    },
    {
      year: "1975",
      event: "International Recognition",
      detail: "Became Sri Lanka's premier gem institute",
    },
    {
      year: "1995",
      event: "Academy Launch",
      detail: "Started professional gemology training programs",
    },
    {
      year: "2010",
      event: "Global Expansion",
      detail: "Opened branches in major cities worldwide",
    },
    {
      year: "2020",
      event: "Digital Transformation",
      detail: "Launched online courses and virtual consultations",
    },
    {
      year: "2024",
      event: "Innovation Hub",
      detail: "State-of-the-art gem research facility opened",
    },
  ];

  const team = [
    {
      name: "Dr. Chandrika Perera",
      role: "Chief Gemologist",
      credentials: "PhD Gemology, GIA Master",
      specialty: "Sapphire & Ruby Expert",
    },
    {
      name: "Rohan Fernando",
      role: "Director of Education",
      credentials: "FGA, DGA Certified",
      specialty: "Gemology Training",
    },
    {
      name: "Priya Jayasinghe",
      role: "Head of Appraisals",
      credentials: "Certified Appraiser",
      specialty: "Rare Gem Valuation",
    },
    {
      name: "Kumar Wickramasinghe",
      role: "Master Jeweler",
      credentials: "35 Years Experience",
      specialty: "Custom Design",
    },
  ];

  const certifications = [
    "Gemological Institute of America (GIA)",
    "Swiss Gemmological Institute SSEF",
    "Gübelin Gem Lab",
    "Asian Institute of Gemological Sciences (AIGS)",
    "International Gemological Institute (IGI)",
    "American Gem Society (AGS)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => {
          const leftPos = (i * 39) % 100;
          const topPos = (i * 27) % 100;
          const duration = (i % 6) + 8;
          const delay = (i % 10) * 0.5;

          return (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gradient-to-r from-amber-300 to-purple-400 rounded-full"
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-r from-amber-400/15 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Crown size={80} className="text-amber-400 mx-auto" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-8rem md:text-12rem font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent"
          >
            Royal Gems Institute
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2.4rem md:text-3.2rem text-slate-300 mb-8 leading-relaxed"
          >
            Where 2000 Years of Sri Lankan Gem Heritage
            <br />
            Meets World-Class Expertise
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-1.8rem text-slate-400 max-w-4xl mx-auto leading-relaxed"
          >
            From the legendary gem mines of Ratnapura to the world stage, we are
            Sri Lanka&apos;s premier institute for gemstones, jewelry, and
            gemological education. Our legacy is built on authenticity,
            excellence, and the timeless beauty of Earth&apos;s treasures.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-[120em] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-purple-400/10 rounded-3xl blur-xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-amber-400/50 transition-all duration-300">
                  <stat.icon size={40} className="text-amber-400 mb-6" />
                  <h3 className="text-5.6rem font-bold text-white mb-3">
                    {stat.number}
                  </h3>
                  <p className="text-1.8rem text-slate-300">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-[100em] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6.4rem font-bold text-white mb-6 flex items-center justify-center gap-4">
              <Sparkles className="text-amber-400" size={48} />
              Our Story
            </h2>
            <p className="text-2rem text-slate-300 max-w-4xl mx-auto leading-relaxed">
              A century-long journey of excellence in the world of precious
              gemstones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-purple-400/20 rounded-3xl blur-2xl"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                  <p className="text-2rem text-slate-300 leading-relaxed mb-6">
                    Sri Lanka, known as the Gem Island for over 2,000 years, has
                    been the source of some of the world&apos;s finest
                    gemstones. In 1924, our founders established Royal Gems
                    Institute with a vision to preserve this heritage while
                    bringing Sri Lankan gems to the global market.
                  </p>
                  <p className="text-2rem text-slate-300 leading-relaxed mb-6">
                    What began as a small family business in Colombo has grown
                    into Sri Lanka&apos;s most respected gemological institute,
                    serving clients and students from over 50 countries.
                  </p>
                  <p className="text-2rem text-slate-300 leading-relaxed">
                    Today, we continue to honor our heritage while embracing
                    innovation, offering everything from rare gem sourcing to
                    professional gemology education, all backed by international
                    certifications and uncompromising standards.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center font-bold text-1.6rem text-black border-4 border-white/10"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {milestone.year}
                    </motion.div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:border-amber-400/50 transition-all duration-300">
                    <h3 className="text-2.4rem font-bold text-white mb-2">
                      {milestone.event}
                    </h3>
                    <p className="text-1.6rem text-slate-400">
                      {milestone.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-[120em] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6.4rem font-bold text-white mb-6 flex items-center justify-center gap-4">
              <Target className="text-purple-400" size={48} />
              Our Core Values
            </h2>
            <p className="text-2rem text-slate-300 max-w-4xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-10 rounded-3xl blur-xl`}
                  whileHover={{ scale: 1.2, opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 group-hover:border-amber-400/50 transition-all duration-300 h-full">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-8`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <value.icon size={32} className="text-white" />
                  </motion.div>
                  <h3 className="text-2.8rem font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-1.6rem text-slate-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-[100em] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6.4rem font-bold text-white mb-6 flex items-center justify-center gap-4">
              <Users className="text-emerald-400" size={48} />
              Expert Team
            </h2>
            <p className="text-2rem text-slate-300 max-w-4xl mx-auto">
              World-class gemologists and educators at your service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users size={40} className="text-white" />
                  </div>
                  <h3 className="text-2.4rem font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-1.8rem text-amber-400 mb-3">
                    {member.role}
                  </p>
                  <p className="text-1.4rem text-slate-400 mb-2">
                    {member.credentials}
                  </p>
                  <p className="text-1.6rem text-slate-300">
                    {member.specialty}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="relative py-24 px-6">
        <div className="max-w-[100em] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-purple-400/10 to-blue-400/10 rounded-3xl blur-2xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-16 border border-white/10">
              <h2 className="text-5.6rem font-bold text-white mb-8 text-center flex items-center justify-center gap-4">
                <Award className="text-amber-400" size={44} />
                International Certifications
              </h2>
              <p className="text-2rem text-slate-300 text-center mb-12 max-w-4xl mx-auto">
                Accredited and recognized by the world&apos;s leading
                gemological institutions
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex items-center gap-4"
                  >
                    <CheckCircle
                      className="text-emerald-400 flex-shrink-0"
                      size={24}
                    />
                    <span className="text-1.8rem text-white">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-[80em] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-purple-400/20 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <div className="relative bg-gradient-to-r from-amber-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-16 border border-white/20 text-center">
              <h2 className="text-5.6rem font-bold text-white mb-6">
                Begin Your Gemstone Journey
              </h2>
              <p className="text-2rem text-slate-300 mb-10 max-w-3xl mx-auto">
                Whether you are looking to invest in precious gems, design
                custom jewelry, or pursue a career in gemology, we are here to
                guide you.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <motion.button
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl font-bold text-1.8rem flex items-center gap-3 hover:from-amber-400 hover:to-orange-500 transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 50px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Collections
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-1.8rem hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
