import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Eye, Lock, Users, CheckCircle, FileText, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

// Professional law enforcement and justice images for slideshow - keeping original first
const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    alt: 'Government Building',
  },
  {
    src: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=800&q=80',
    alt: 'Law Enforcement Officers',
  },
  {
    src: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800&q=80',
    alt: 'Courtroom Interior',
  },
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    alt: 'Police Administrative Office',
  },
];

const features = [
  {
    icon: FileText,
    title: 'Secure Reporting',
    description: 'Submit confidential crime reports with end-to-end encryption and secure evidence upload.',
  },
  {
    icon: Eye,
    title: 'Track Progress',
    description: 'Monitor your case status in real-time using your unique tracking ID.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Role-based access for citizens, investigators, and administrators with proper authentication.',
  },
];

const stats = [
  { value: '50,000+', label: 'Cases Filed' },
  { value: '95%', label: 'Resolution Rate' },
  { value: '24/7', label: 'Service Available' },
  { value: '100+', label: 'Agencies Connected' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      goToNextSlide();
    }, 2800);
    
    return () => clearInterval(interval);
  }, [isPaused, goToNextSlide]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-800/5 to-transparent dark:from-navy-800/10" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/10 text-navy-800 dark:text-navy-400 text-sm font-medium rounded-full">
                  <Shield className="w-4 h-4" />
                  Official Government Portal
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight"
              >
                Secure Crime
                <span className="block text-navy-800 dark:text-navy-400">
                  Reporting System
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-lg"
              >
                LawConnect is the official platform for citizens to report crimes, 
                submit evidence, and track case progress through secure, authenticated channels.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                      Report a Crime
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="btn-outline inline-flex items-center justify-center gap-2">
                      Login
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    256-bit Encryption
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Verified Reports
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image Slideshow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div 
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="absolute -inset-4 bg-navy-800/5 rounded-2xl" />
                
                {/* Image Container with Fixed Height */}
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={heroImages[currentSlide].src}
                      alt={heroImages[currentSlide].alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Left Arrow */}
                  <button
                    onClick={goToPrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={goToNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Case #12489</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Successfully Resolved</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-[#1e3a8a] dark:bg-navy-400 w-6'
                          : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-navy-400">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Our Services
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive crime reporting and case management system designed for transparency and efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card card-hover p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Submit a Report?
            </h2>
            <p className="text-navy-200 mb-8 max-w-xl mx-auto">
              Join thousands of citizens who have contributed to safer communities through our secure reporting system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-800 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-700 text-white font-semibold rounded-lg hover:bg-navy-600 transition-colors border border-navy-600"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LawConnect</span>
              </div>
              <p className="text-sm max-w-md">
                Official government portal for secure crime reporting and case management. 
                Committed to transparency and public safety.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/report-crime" className="hover:text-white transition-colors">Report Crime</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1-800-LAW-CONNECT
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Washington, D.C.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
            <p>© {new Date().getFullYear()} LawConnect. All rights reserved. Official Government System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
