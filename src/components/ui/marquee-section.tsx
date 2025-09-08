'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const donationFacts = [
  "500,000 people die each year waiting for organ transplants",
  "India needs 12 million blood units annually; 1 million units go unmet!",
  "9% shortage in blood supply and >96% shortage in organ availability every year.",
  "Less than 1% donate blood regularly; <0.01% pledge organs.",
  "One Blood Donation can save upto Three Lives",
  "Blood cannot be manufactured – it can only come from donors",
  "A single car accident victim can require up to 100 units of blood",
  "Type O- blood is universal and can be given to anyone in an emergency",
  "Every 2 seconds someone needs blood in India",
  "Less than 10% of eligible population donates blood",
  "Platelets, critical for cancer patients, have a shelf life of just 5 days"
];

export default function MarqueeSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [duplicatedFacts, setDuplicatedFacts] = useState<string[]>([]);

  useEffect(() => {
    // Duplicate the facts to create a seamless loop
    setDuplicatedFacts([...donationFacts, ...donationFacts]);
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-[#8B0000] to-[#DC143C] py-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/blood-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-white text-center text-2xl font-bold mb-2">Blood Donation Facts</h2>
      </div>
      <div 
        ref={marqueeRef}
        className="flex whitespace-nowrap animate-marquee"
      >
        {duplicatedFacts.map((fact, index) => (
          <motion.div 
            key={index} 
            className="mx-8 text-xl font-medium bg-gradient-to-r from-white to-[#FFD700] bg-clip-text text-transparent flex items-center"
            initial={{ opacity: 0.8 }}
            whileHover={{ scale: 1.05, opacity: 1 }}
          >
            <span className="mr-2 text-white">•</span>
            {fact}
          </motion.div>
        ))}
      </div>
    </section>
  );
}