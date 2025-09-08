'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, Hospital, Users, Clock, Award, Calendar, MapPin, Droplets } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  endValue: number;
  suffix?: string;
  delay?: number;
}

const StatCard = ({ icon, title, value, endValue, suffix = '', delay = 0 }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const duration = 2500; // 2.5 seconds animation
      const startTime = Date.now();
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Use easeOutExpo for more dynamic counting effect
          const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(easeOutExpo * endValue);
          
          setCount(currentCount);
          
          if (progress === 1) {
            clearInterval(interval);
          }
        }, 16); // ~60fps
        
        return () => clearInterval(interval);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, endValue, delay, hasAnimated]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.7, delay: delay / 1000, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="glass-morphism rounded-xl p-6 flex flex-col items-center justify-center text-center animate-float cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <motion.div 
        className="text-red-500 mb-4"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: -10 }}
        transition={{ duration: 0.5, delay: (delay / 1000) + 0.3 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <AnimatePresence>
        {isInView && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent"
          >
            {count}{suffix}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function StatisticsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#36454F] to-[#000000] relative overflow-hidden">
      {/* Background blood cells pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-red-500"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full border-2 border-red-300"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full border-2 border-red-400"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full border-2 border-red-600"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-300 text-sm font-medium mb-4"
          >
            OUR IMPACT
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-center mb-4 text-white"
          >
            Making a Difference Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Through our comprehensive blood donation network, we've created a life-saving ecosystem that connects generous donors with critical medical needs. Every pint of blood donated can save up to three lives, supporting emergency surgeries, cancer treatments, and trauma care. Our 24/7 emergency response system ensures that hospitals receive the right blood type exactly when needed, while our AI-powered matching system optimizes donor-patient compatibility across 1,200+ collection centers nationwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400"
          >
            <span className="bg-red-500/10 px-3 py-1 rounded-full">🩸 1 donation = 3 lives saved</span>
            <span className="bg-red-500/10 px-3 py-1 rounded-full">⚡ 24/7 emergency response</span>
            <span className="bg-red-500/10 px-3 py-1 rounded-full">🤖 AI-powered matching</span>
            <span className="bg-red-500/10 px-3 py-1 rounded-full">🏥 1,200+ partner hospitals</span>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard 
            icon={<Heart size={48} />}
            title="Lives Saved"
            value="0"
            endValue={150000}
            suffix="+"
            delay={0}
          />
          
          <StatCard 
            icon={<Hospital size={48} />}
            title="Partner Hospitals"
            value="100"
            endValue={500}
            suffix="+"
            delay={200}
          />
          
          <StatCard 
            icon={<Users size={48} />}
            title="Active Donors"
            value="10000"
            endValue={75000}
            suffix="+"
            delay={400}
          />
          
          <StatCard 
            icon={<Clock size={48} />}
            title="Emergency Responses"
            value="6"
            endValue={24}
            suffix="/7"
            delay={600}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            icon={<Droplets size={48} />}
            title="Blood Units Collected"
            value="30000"
            endValue={250000}
            suffix="+"
            delay={300}
          />
          
          <StatCard 
            icon={<MapPin size={48} />}
            title="Collection Centers"
            value="20"
            endValue={1200}
            suffix="+"
            delay={500}
          />
          
          <StatCard 
            icon={<Calendar size={48} />}
            title="Annual Drives"
            value="12"
            endValue={365}
            suffix="+"
            delay={700}
          />
          
          <StatCard 
            icon={<Award size={48} />}
            title="Years of Service"
            value="10"
            endValue={15}
            suffix="+"
            delay={900}
          />
        </div>
      </div>
    </section>
  );
}