'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Info, Heart, AlertTriangle } from 'lucide-react';

const bloodTypes = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

interface BloodTypeInfoProps {
  selectedType: string | null;
}

const BloodTypeInfo = ({ selectedType }: BloodTypeInfoProps) => {
  // Blood type compatibility information
  const bloodTypeData: Record<string, { 
    canGiveTo: string[], 
    canReceiveFrom: string[], 
    percentage: number,
    facts: string[],
    demand: 'High' | 'Medium' | 'Low'
  }> = {
    'A+': {
      canGiveTo: ['A+', 'AB+'],
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      percentage: 35.7,
      facts: ['Most common blood type in India', 'Can receive from both A and O types'],
      demand: 'Medium'
    },
    'O+': {
      canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
      canReceiveFrom: ['O+', 'O-'],
      percentage: 37.4,
      facts: ['Universal donor for all positive blood types', 'Most versatile for donations'],
      demand: 'High'
    },
    'B+': {
      canGiveTo: ['B+', 'AB+'],
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      percentage: 8.5,
      facts: ['More common in Asian populations', 'Can donate to B+ and AB+ recipients'],
      demand: 'Medium'
    },
    'AB+': {
      canGiveTo: ['AB+'],
      canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      percentage: 3.4,
      facts: ['Universal recipient', 'Can receive blood from any type', 'Rarest positive blood type'],
      demand: 'Low'
    },
    'A-': {
      canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
      canReceiveFrom: ['A-', 'O-'],
      percentage: 6.3,
      facts: ['Can donate to both A and AB types', 'Negative types are always in higher demand'],
      demand: 'High'
    },
    'O-': {
      canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canReceiveFrom: ['O-'],
      percentage: 6.6,
      facts: ['Universal donor for all blood types', 'Most valuable blood type for emergencies', 'Always in critical demand'],
      demand: 'High'
    },
    'B-': {
      canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
      canReceiveFrom: ['B-', 'O-'],
      percentage: 1.5,
      facts: ['Rare blood type', 'Can donate to both B and AB types'],
      demand: 'High'
    },
    'AB-': {
      canGiveTo: ['AB+', 'AB-'],
      canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
      percentage: 0.6,
      facts: ['Rarest of all blood types', 'Can receive from all negative types'],
      demand: 'Medium'
    }
  };

  if (!selectedType) return null;

  const data = bloodTypeData[selectedType];
  const demandColor = {
    'High': 'text-red-500',
    'Medium': 'text-amber-500',
    'Low': 'text-green-500'
  }[data.demand];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 glass-morphism rounded-xl text-white max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="mb-6 p-4 bg-black/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">{selectedType}</h3>
              <div className="flex items-center">
                <span className={`font-bold ${demandColor} mr-2`}>{data.demand}</span>
                <span className="text-sm text-gray-300">Demand</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.percentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
              />
            </div>
            <p className="text-sm text-gray-300 mt-1">{data.percentage}% of population</p>
          </div>
          
          <div className="mb-6">
            <h3 className="flex items-center text-xl font-bold mb-3 text-amber-400">
              <Info size={18} className="mr-2" /> Blood Type Facts
            </h3>
            <ul className="space-y-2">
              {data.facts.map((fact, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="flex items-start"
                >
                  <span className="text-red-400 mr-2">•</span>
                  <span>{fact}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="flex items-center text-xl font-bold mb-4 text-red-400">
              <Droplet size={18} className="mr-2" fill="#f87171" /> You can give to:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.canGiveTo.map((type, index) => (
                <motion.div 
                  key={`give-${type}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)" }}
                  className="bg-gradient-to-br from-red-900/80 to-red-800/50 p-4 rounded-lg text-center font-bold border border-red-700/30 cursor-pointer"
                >
                  {type}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3 italic">Your blood can help {data.canGiveTo.length} blood type{data.canGiveTo.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div>
            <h3 className="flex items-center text-xl font-bold mb-4 text-green-400">
              <Heart size={18} className="mr-2" fill="#4ade80" /> You can receive from:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.canReceiveFrom.map((type, index) => (
                <motion.div 
                  key={`receive-${type}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(74, 222, 128, 0.5)" }}
                  className="bg-gradient-to-br from-green-900/80 to-green-800/50 p-4 rounded-lg text-center font-bold border border-green-700/30 cursor-pointer"
                >
                  {type}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3 italic">You can receive from {data.canReceiveFrom.length} blood type{data.canReceiveFrom.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="md:col-span-2 mt-4 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle size={20} className="text-amber-400 mr-2 mt-1 flex-shrink-0" />
              <p className="text-sm">
                <span className="font-bold text-amber-400">Important:</span> Blood type compatibility is critical for transfusions. 
                Incompatible blood types can cause severe reactions. Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function BloodTypeSection() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    if (selectedType) {
      setShowIntro(false);
    }
  }, [selectedType]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#000000] to-[#36454F] relative overflow-hidden">
      {/* Background blood cells */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full border border-red-500"></div>
        <div className="absolute bottom-40 right-1/4 w-60 h-60 rounded-full border border-red-500"></div>
        <div className="absolute top-1/3 right-1/5 w-20 h-20 rounded-full border border-red-500"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-300 text-sm font-medium mb-4"
          >
            BLOOD COMPATIBILITY
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-center mb-4 text-white"
          >
            Select Your Blood Type
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Learn about your blood type compatibility and how you can help save lives through donation
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
          {bloodTypes.map((type, index) => (
            <motion.button
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}
              className={`relative p-6 rounded-xl font-bold text-2xl transition-all duration-300 ${selectedType === type 
                ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/30' 
                : 'bg-gray-800/80 text-white hover:bg-gray-700/90 border border-gray-700/50'}`}
              onClick={() => setSelectedType(type)}
            >
              <Droplet 
                size={16} 
                className={`absolute top-2 right-2 ${selectedType === type ? 'text-red-300' : 'text-gray-500'}`} 
                fill={selectedType === type ? '#f87171' : 'transparent'} 
              />
              {type}
              {selectedType === type && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="selectedBloodType"
                />
              )}
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {showIntro && !selectedType ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 p-6 glass-morphism rounded-xl text-white max-w-3xl mx-auto text-center"
            >
              <Droplet size={40} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-3">Why Blood Type Matters</h3>
              <p className="mb-4">
                Your blood type is determined by the presence or absence of specific antigens on your red blood cells.
                Understanding your blood type is crucial for safe transfusions and can help you make informed decisions about donation.
              </p>
              <p className="text-sm text-gray-400">
                Select your blood type above to learn more about compatibility and donation opportunities.
              </p>
            </motion.div>
          ) : (
            <BloodTypeInfo key="info" selectedType={selectedType} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}