import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, ChevronRight, Star, Zap, Code, ArrowDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isHowItWorksInView = useInView(howItWorksRef, { once: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setShowPopup(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <motion.header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Bot className={`w-8 h-8 ${isScrolled ? 'text-blue-400' : 'text-white'}`} />
              <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>
                Build AI
              </span>
            </motion.div>
            <motion.nav 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a href="#features" className={`${isScrolled ? 'text-gray-300' : 'text-white'} hover:text-blue-400 transition`}>
                Features
              </a>
              <a href="#how-it-works" className={`${isScrolled ? 'text-gray-300' : 'text-white'} hover:text-blue-400 transition`}>
                How it Works
              </a>
              <a href="#pricing" className={`${isScrolled ? 'text-gray-300' : 'text-white'} hover:text-blue-400 transition`}>
                Pricing
              </a>
              <motion.button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Bento Grid */}
      <section ref={heroRef} className="relative min-h-screen pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-black opacity-90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Headline Tile */}
            <motion.div 
              className="md:col-span-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                Build websites with AI, instantly.
              </h1>
              <p className="text-xl text-gray-300">
                Transform your ideas into beautiful, functional websites with the power of artificial intelligence.
              </p>
            </motion.div>

            {/* Feature Highlight Tile */}
            <motion.div 
              className="md:col-span-4 bg-blue-600/20 backdrop-blur-sm rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">Lightning Fast</span>
              </div>
              <p className="text-gray-300">Generate complete websites in seconds with our advanced AI technology.</p>
            </motion.div>

            {/* Form Tile */}
            <motion.div 
              className="md:col-span-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the website you want to build..."
                  className="w-full h-32 p-4 bg-white/10 text-white placeholder-gray-400 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none transition focus:outline-none mb-4 backdrop-blur-sm"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Website Plan
                  <ChevronRight className="ml-2" />
                </motion.button>
              </form>
            </motion.div>

            {/* Stats Tile */}
            <motion.div 
              className="md:col-span-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-2xl font-bold text-white">10K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Websites Generated</span>
                  <span className="text-2xl font-bold text-white">50K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">User Rating</span>
                  <span className="text-2xl font-bold text-white">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-white" />
        </motion.div>
      </section>

      {/* Features Section with Bento Grid */}
      <section ref={featuresRef} id="features" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Powerful Features for Modern Web Development
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="md:col-span-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8"
              variants={itemVariants}
            >
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Generate complete websites in seconds with our advanced AI technology.</p>
            </motion.div>
            <motion.div 
              className="md:col-span-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8"
              variants={itemVariants}
            >
              <Code className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Clean Code</h3>
              <p className="text-gray-400">Get production-ready, maintainable code that follows best practices.</p>
            </motion.div>
            <motion.div 
              className="md:col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8"
              variants={itemVariants}
            >
              <Star className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
              <p className="text-gray-400">Create stunning, responsive designs that look great on any device.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
          >
            {[
              { number: 1, title: "Describe Your Vision", description: "Tell us what you want to build in plain English." },
              { number: 2, title: "AI Generation", description: "Our AI creates a complete website based on your description." },
              { number: 3, title: "Customize & Deploy", description: "Make adjustments and deploy your website instantly." }
            ].map((step) => (
              <motion.div 
                key={step.number}
                className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Bot className="w-8 h-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Build AI</span>
              </div>
              <p className="mt-4 text-gray-400">
                Building the future of web development with AI.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How it Works</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Build AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Popup */}
      {showPopup && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Oops!</h2>
            <p className="text-gray-300 mb-6">
              You have exhausted your API credits. Please contact the admin to recharge.
            </p>
            <motion.button
              onClick={() => setShowPopup(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
