"use client";

import { Truck, RotateCcw, Shield, Calendar, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitItem = ({ icon, title, description, delay }: BenefitItemProps) => {
  return (
    <motion.div 
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="rounded-full bg-primary/10 p-2.5 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export function ShippingBanner() {
  return (
    <div className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-8 mt-12 mb-4">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BenefitItem
            icon={<Truck className="h-5 w-5" />}
            title="Free Shipping"
            description="On all orders over $50"
            delay={0.1}
          />
          
          <BenefitItem
            icon={<RotateCcw className="h-5 w-5" />}
            title="Easy Returns"
            description="30-day money back guarantee"
            delay={0.2}
          />
          
          <BenefitItem
            icon={<Shield className="h-5 w-5" />}
            title="Secure Payments"
            description="SSL / Secure checkout"
            delay={0.3}
          />
          
          <BenefitItem
            icon={<CreditCard className="h-5 w-5" />}
            title="Flexible Payment"
            description="Pay with multiple credit cards"
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
} 