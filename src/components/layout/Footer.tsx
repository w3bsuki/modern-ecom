"use client";

import { useState } from "react";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Shop",
    links: [
      { name: "All Products", href: "/collections" },
      { name: "New Arrivals", href: "/new/arrivals" },
      { name: "Best Sellers", href: "/new/best-sellers" },
      { name: "On Sale", href: "/sale" },
    ],
  },
  {
    title: "Collections",
    links: [
      { name: "Snapback", href: "/styles/snapback" },
      { name: "Fitted", href: "/styles/fitted" },
      { name: "Dad Hats", href: "/styles/dad-hats" },
      { name: "Beanies", href: "/styles/beanies" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Stores", href: "/stores" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }
    
    setValidationError("");
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // Replace with actual newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      // Clear form after successful submission
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      setValidationError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Stay Updated</h3>
              <p className="max-w-md text-white/70 mb-6">
                Subscribe to our newsletter for exclusive access to new drops, limited edition releases, and style inspiration.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                    aria-label={link.label}
                  >
                    <link.icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="email-address" className="block text-sm font-medium text-white/80">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Input
                      type="email"
                      id="email-address"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting || isSubscribed}
                      aria-describedby={validationError ? "email-error" : undefined}
                      className={cn(
                        "h-12 border-white/20 bg-white/10 text-white placeholder:text-white/40 dark:border-white/20",
                        validationError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      )}
                    />
                  </div>
                  {validationError && (
                    <p className="mt-1 text-sm text-red-500" id="email-error">
                      {validationError}
                    </p>
                  )}
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-4 sm:mt-0 sm:flex-1">
                    {!isSubscribed ? (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || isSubscribed}
                        className="h-12 px-6 w-full sm:w-auto bg-white text-black border border-white hover:bg-black hover:text-white hover:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white min-w-[140px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        <span className="text-sm">Successfully subscribed!</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-white/60 sm:mt-0 sm:ml-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Membership CTA */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Join the NoCAP Club</h2>
          <p className="max-w-2xl mx-auto mb-6 text-white/70">
            Get exclusive access to limited edition drops, early releases, and member-only perks.
          </p>
          <Button asChild variant="outline" size="lg" className="group border-white bg-white text-black hover:bg-black hover:text-white">
            <Link href="/membership" className="flex items-center gap-2">
              Join the Club
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-10">
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="text-base font-semibold uppercase tracking-wider mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              © {new Date().getFullYear()} NoCapLLC. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/40">
            All product names, logos, and brands are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 