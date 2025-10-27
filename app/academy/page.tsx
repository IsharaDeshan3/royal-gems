"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  Globe,
  Diamond,
  Crown,
  Sparkles,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Quote,
  AwardIcon,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  price: number;
  description: string;
  modules: string[];
  certification: string;
  image: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  course: string;
  rating: number;
  review: string;
  image: string;
  occupation: string;
}

const AcademyPage = () => {
  // const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [enrollmentForm, setEnrollmentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    course: "",
    experience: "",
  });
  const [showEnrollment, setShowEnrollment] = useState(false);

  const courses: Course[] = [
    {
      id: "gemology-foundation",
      title: "Foundation in Gemology",
      duration: "6 months",
      level: "Beginner",
      price: 125000,
      description:
        "Master the fundamentals of gem identification, properties, and Sri Lankan gemstone heritage.",
      modules: [
        "Introduction to Gemology",
        "Crystal Systems & Structures",
        "Optical Properties of Gems",
        "Sri Lankan Gemstone Geography",
        "Basic Gem Identification",
        "Gem Testing Equipment",
      ],
      certification: "Ceylon Gemology Foundation Certificate",
      image: "/gem-course-1.jpg",
    },
    {
      id: "advanced-gemology",
      title: "Advanced Gemology & Appraisal",
      duration: "12 months",
      level: "Intermediate",
      price: 285000,
      description:
        "Advanced gem identification, grading, and professional appraisal techniques for precious stones.",
      modules: [
        "Advanced Gem Identification",
        "Color Theory & Grading",
        "Clarity Assessment",
        "Cut Quality Analysis",
        "Gem Enhancement Detection",
        "Professional Appraisal Methods",
        "Market Valuation",
        "Ceylon Sapphire Expertise",
      ],
      certification: "Professional Gemologist Certificate",
      image: "/gem-course-2.jpg",
    },
    {
      id: "jewelry-design",
      title: "Jewelry Design & Craftsmanship",
      duration: "8 months",
      level: "Creative",
      price: 195000,
      description:
        "Learn traditional Sri Lankan jewelry crafting techniques combined with modern design principles.",
      modules: [
        "Design Principles",
        "Traditional Sri Lankan Techniques",
        "CAD Design Software",
        "Metalworking Fundamentals",
        "Stone Setting Methods",
        "Finishing Techniques",
      ],
      certification: "Jewelry Design Professional Certificate",
      image: "/jewelry-design.jpg",
    },
    {
      id: "gem-trading",
      title: "Gem Trading & Business",
      duration: "4 months",
      level: "Professional",
      price: 165000,
      description:
        "Master the business aspects of gem trading, including market analysis and international commerce.",
      modules: [
        "Global Gem Markets",
        "Import/Export Regulations",
        "Pricing Strategies",
        "Quality Standards",
        "Customer Relations",
        "Digital Marketing for Gems",
      ],
      certification: "Gem Business Professional Certificate",
      image: "/gem-trading.jpg",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Priya Wijesinghe",
      location: "Ratnapura, Sri Lanka",
      course: "Advanced Gemology & Appraisal",
      rating: 5,
      review:
        "This course transformed my understanding of Sri Lankan gemstones. The practical sessions at the Ratnapura mines were invaluable. Now I'm running my own gemstone appraisal business.",
      image: "/student-1.jpg",
      occupation: "Gemstone Appraiser",
    },
    {
      id: "2",
      name: "Chaminda Perera",
      location: "Kandy, Sri Lanka",
      course: "Foundation in Gemology",
      rating: 5,
      review:
        "As someone from a gem mining family, this course gave me the scientific knowledge I needed. The instructors' expertise in Ceylon sapphires is unmatched.",
      image: "/student-2.jpg",
      occupation: "Third-generation Gem Miner",
    },
    {
      id: "3",
      name: "Sarah Fernando",
      location: "Colombo, Sri Lanka",
      course: "Jewelry Design & Craftsmanship",
      rating: 5,
      review:
        "The combination of traditional Kandyan jewelry techniques with modern design opened up incredible opportunities. I now design for international clients.",
      image: "/student-3.jpg",
      occupation: "Jewelry Designer",
    },
    {
      id: "4",
      name: "Ruwan Dissanayake",
      location: "Galle, Sri Lanka",
      course: "Gem Trading & Business",
      rating: 4,
      review:
        "This course helped me expand my family gem business internationally. The export procedures and quality standards modules were particularly helpful.",
      image: "/student-4.jpg",
      occupation: "Gem Export Business Owner",
    },
    {
      id: "5",
      name: "Malini Rajapakse",
      location: "Negombo, Sri Lanka",
      course: "Advanced Gemology & Appraisal",
      rating: 5,
      review:
        "The practical approach and hands-on experience with authentic Sri Lankan gems made all the difference. Highly recommend for serious gemology students.",
      image: "/student-5.jpg",
      occupation: "Museum Gemologist",
    },
    {
      id: "6",
      name: "Kasun Bandara",
      location: "Embilipitiya, Sri Lanka",
      course: "Foundation in Gemology",
      rating: 5,
      review:
        "From the gem fields of Embilipitiya to international certification - this course gave me the credibility I needed in the global market.",
      image: "/student-6.jpg",
      occupation: "Rough Gem Dealer",
    },
  ];

  const handleEnrollment = (courseId: string) => {
    setEnrollmentForm({ ...enrollmentForm, course: courseId });
    setShowEnrollment(true);
  };

  const submitEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle enrollment submission
    alert(
      "Enrollment application submitted successfully! We will contact you within 24 hours."
    );
    setShowEnrollment(false);
    setEnrollmentForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      course: "",
      experience: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-l from-purple-400/10 to-pink-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.7, 1],
            x: [0, -50, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[12, 28, 44, 68, 84, 18, 36, 52, 76, 92].map((left, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            style={{
              left: `${left}%`,
              top: `${(i * 31) % 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
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
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 h-screen flex items-center snap-start">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown size={32} className="text-amber-400 opacity-70" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-6">
                Royal Gems Academy
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
                Master the ancient art and modern science of gemology in the
                heart of Sri Lanka, the world&apos;s treasure island of precious
                stones
              </p>

              <div className="flex flex-wrap justify-center gap-8 text-slate-400">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>ISO Certified Programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <span>International Recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>500+ Graduates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 h-screen snap-end">
          <div className="max-w-[130em] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-4">
                Professional Gemology Programs
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                From fundamental gem identification to advanced trading
                strategies, master every aspect of the gemstone industry
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-24">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                      <Diamond size={64} className="text-white/60" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Level badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-black text-sm font-bold">
                      {course.level}
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AwardIcon size={16} />
                        <span>Certified</span>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course modules preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-amber-400 mb-2">
                        Key Modules:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {course.modules.slice(0, 3).map((module, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/10 rounded-lg text-xs text-slate-300"
                          >
                            {module}
                          </span>
                        ))}
                        {course.modules.length > 3 && (
                          <span className="px-2 py-1 text-xs text-slate-400">
                            +{course.modules.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        LKR {course.price.toLocaleString()}
                      </div>

                      <motion.button
                        onClick={() => handleEnrollment(course.id)}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-xl font-bold hover:from-amber-400 hover:to-orange-500 transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Enroll Now
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 h-screen snap-start">
          <div className="max-w-[130em] mx-auto pt-54">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-4">
                Success Stories from Sri Lanka
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                Hear from our graduates who are now leading professionals in the
                gemstone industry across Sri Lanka
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-2xl relative group hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -3 }}
                >
                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Quote size={24} className="text-amber-400" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < testimonial.rating
                            ? "text-amber-400 fill-current"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <blockquote className="text-slate-300 leading-relaxed mb-6 italic">
                    {testimonial.review}
                  </blockquote>

                  {/* Student info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-amber-400">
                        {testimonial.occupation}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={12} />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Course badge */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-xs text-slate-400">Completed: </span>
                    <span className="text-xs text-amber-300 font-medium">
                      {testimonial.course}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 snap-start">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-4">
                Why Royal Gems Academy?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Sri Lankan Heritage",
                  description:
                    "Learn from the source of the world's finest sapphires and precious gems",
                },
                {
                  icon: Award,
                  title: "Expert Instructors",
                  description:
                    "Learn from certified gemologists with decades of industry experience",
                },
                {
                  icon: AwardIcon,
                  title: "International Recognition",
                  description:
                    "Our certificates are recognized globally by leading gem institutions",
                },
                {
                  icon: Users,
                  title: "Industry Network",
                  description:
                    "Connect with Sri Lanka's gem mining and trading communities",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={32} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Enrollment */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles size={24} className="text-amber-400 opacity-40" />
                </motion.div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-6">
                Ready to Begin Your Gemology Journey?
              </h2>

              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of successful graduates and become part of Sri
                Lanka&apos;s prestigious gemstone community
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-center">
                  <Phone size={24} className="text-amber-400 mb-2" />
                  <span className="text-white font-medium">
                    +94 11 234 5678
                  </span>
                  <span className="text-slate-400 text-sm">
                    Mon-Fri 9AM-5PM
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Mail size={24} className="text-amber-400 mb-2" />
                  <span className="text-white font-medium">
                    academy@royalgems.lk
                  </span>
                  <span className="text-slate-400 text-sm">Quick response</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <MapPin size={24} className="text-amber-400 mb-2" />
                  <span className="text-white font-medium">
                    Colombo 03, Sri Lanka
                  </span>
                  <span className="text-slate-400 text-sm">
                    Visit our campus
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => setShowEnrollment(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl font-bold text-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GraduationCap size={24} />
                Start Your Application
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {showEnrollment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEnrollment(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Course Enrollment
                </h2>
                <button
                  onClick={() => setShowEnrollment(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitEnrollment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      placeholder="First Name"
                      value={enrollmentForm.firstName}
                      onChange={(e) =>
                        setEnrollmentForm({
                          ...enrollmentForm,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      placeholder="Last Name"
                      value={enrollmentForm.lastName}
                      onChange={(e) =>
                        setEnrollmentForm({
                          ...enrollmentForm,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    placeholder="your.email@example.com"
                    value={enrollmentForm.email}
                    onChange={(e) =>
                      setEnrollmentForm({
                        ...enrollmentForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    placeholder="+94 77 123 4567"
                    value={enrollmentForm.phone}
                    onChange={(e) =>
                      setEnrollmentForm({
                        ...enrollmentForm,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Course *
                  </label>
                  <select
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                    value={enrollmentForm.course}
                    onChange={(e) =>
                      setEnrollmentForm({
                        ...enrollmentForm,
                        course: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option
                        key={course.id}
                        value={course.id}
                        className="bg-slate-800"
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Previous Experience (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 resize-none"
                    placeholder="Tell us about any previous experience with gemstones, jewelry, or related fields..."
                    value={enrollmentForm.experience}
                    onChange={(e) =>
                      setEnrollmentForm({
                        ...enrollmentForm,
                        experience: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEnrollment(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-xl font-bold hover:from-amber-400 hover:to-orange-500 transition-all duration-300"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademyPage;
