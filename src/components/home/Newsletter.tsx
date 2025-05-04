"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle, Gift, TrendingUp, Bell, Heart } from "lucide-react";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
}

export function Newsletter({ 
  title = "Join Our Newsletter", 
  subtitle = "Stay updated with the latest styles, exclusive offers, and hat care tips."
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Simulate API call
    try {
      // In a real app, you would submit to an API here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(
      "py-24 relative overflow-hidden transition-colors duration-300",
      "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black border-t border-gray-100 dark:border-gray-800"
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.3 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/40 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.2 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute -left-12 top-1/2 w-72 h-72 rounded-full bg-indigo-100 dark:bg-indigo-900/40 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.15 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/30 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Content section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3 text-left"
            >
              <div className="inline-flex items-center mb-6 bg-black/5 dark:bg-white/10 rounded-full px-4 py-1.5">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Subscribe for exclusive updates</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">{title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-lg">{subtitle}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: Gift, text: "10% off your first order" },
                  { icon: TrendingUp, text: "Early access to new collections" },
                  { icon: Bell, text: "Restock notifications" },
                  { icon: Heart, text: "Personalized style recommendations" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="flex items-center"
                  >
                    <div className="mr-2 text-black dark:text-white opacity-75">
                      <item.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Form section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-gray-900/20"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">Thanks for subscribing!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">We&apos;ve sent a confirmation to your email with a special welcome gift.</p>
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-block mt-2 text-black dark:text-white font-medium underline cursor-pointer"
                      onClick={() => setIsSuccess(false)}
                    >
                      Subscribe another email
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-gray-900/20"
                >
                  <h3 className="text-xl font-bold mb-4">Join our community</h3>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4"
                    >
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className={`mb-4 relative border ${focusedInput ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center px-3 absolute left-0 top-0 h-full text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        placeholder="Your email address"
                        className={cn(
                          "w-full px-10 py-4 focus:outline-none border-0",
                          "text-gray-800 bg-transparent dark:text-gray-100",
                          "placeholder-gray-400 dark:placeholder-gray-500",
                          "transition-all duration-200"
                        )}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="relative group w-full"
                      disabled={isSubmitting}
                    >
                      <div className="relative overflow-hidden">
                        {/* Base button */}
                        <div className="bg-white border border-black py-4 flex items-center justify-center">
                          {isSubmitting ? (
                            <div className="flex items-center justify-center relative z-10">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-black group-hover:text-white uppercase font-bold tracking-wider relative z-10">Subscribing...</span>
                            </div>
                          ) : (
                            <span className="text-black uppercase font-bold tracking-wider relative z-10">Subscribe Now</span>
                          )}
                        </div>
                        
                        {/* Animated overlay */}
                        <div className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        
                        {/* Text that changes color */}
                        <span className="absolute inset-0 flex items-center justify-center text-black group-hover:text-white uppercase font-bold tracking-wider transition-colors duration-300">
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Subscribing...</span>
                            </div>
                          ) : "Subscribe Now"}
                        </span>
                      </div>
                    </motion.button>
                    
                    <motion.p 
                      className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoaded ? 0.8 : 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
                    </motion.p>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter; 