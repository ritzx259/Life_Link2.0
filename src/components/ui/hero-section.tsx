'use client';

import { motion } from 'framer-motion';
import { Heart, Hospital, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ShaderAnimation from './shader-animation';

const HeroSection = () => {
  const router = useRouter();

  const handleDonorRegister = () => {
    router.push('/register');
  };

  const handleHospitalLogin = () => {
    router.push('/login');
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Shader Animation Background */}
      <ShaderAnimation />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            LifeLink
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Donor Health & Hospital Matching
          </h2>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
            Smarter, Faster, Life-Saving Donations
          </p>
        </motion.div>
        
        {/* Icons */}
        <motion.div 
          className="flex justify-center gap-8 mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full"
          >
            <Heart size={40} className="text-white" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.2, rotate: -5 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full"
          >
            <Hospital size={40} className="text-white" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full"
          >
            <Activity size={40} className="text-white" />
          </motion.div>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
            onClick={handleDonorRegister}
            whileHover={{ scale: 1.05 }}
            as={motion.button}
          >
            Register as Donor
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
            onClick={handleHospitalLogin}
            whileHover={{ scale: 1.05 }}
            as={motion.button}
          >
            Hospital Login
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;