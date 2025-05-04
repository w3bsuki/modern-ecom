"use client";

import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernNewsletterProps {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
}

export function ModernNewsletter({
  className,
  title = "Stay in the loop",
  description = "Subscribe to our newsletter for exclusive updates, style tips, and early access to new collections.",
  buttonText = "Subscribe",
  successMessage = "Thank you for subscribing! Check your email to confirm your subscription.",
}: ModernNewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 5000);
    }, 1500);
  };
  
  return (
    <section className={cn(
      "py-16 md:py-20 bg-black text-white relative overflow-hidden",
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -left-10 -top-10 w-80 h-80 rounded-full border border-white"></div>
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full border border-white"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full border border-white"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-300 mb-8">{description}</p>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={cn(
                        "w-full px-4 py-3 bg-white/10 border border-white/20 text-white",
                        "placeholder:text-gray-400 rounded-md backdrop-blur-sm",
                        "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent",
                        error ? "border-red-500 focus:ring-red-500" : ""
                      )}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-xs mt-1">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "px-6 py-3 bg-white text-black font-medium rounded-md relative overflow-hidden",
                      "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                      "transition-all duration-300 ease-in-out",
                      loading ? "cursor-wait" : ""
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        <>
                          {buttonText}
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center gap-2 px-4 py-6 border border-white/10 rounded-md bg-white/5"
              >
                <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
                <p className="text-white font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="text-xs text-gray-400 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ModernNewsletter; 