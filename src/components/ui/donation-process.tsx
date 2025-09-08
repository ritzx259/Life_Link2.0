'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Stethoscope, Droplet, Clock } from 'lucide-react';

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ProcessStep = ({ icon, title, description, index }: ProcessStepProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex flex-col items-center text-center p-6 glass-morphism rounded-xl"
    >
      <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default function DonationProcess() {
  const steps = [
    {
      icon: <ClipboardCheck className="h-8 w-8 text-white" />,
      title: "Registration Process",
      description: "Sign up and schedule your first donation with ease. Our AI system will guide you through the process."
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-white" />,
      title: "Health Screening",
      description: "A simple check-up to ensure you're ready to donate. Our AI analyzes your health metrics for eligibility."
    },
    {
      icon: <Droplet className="h-8 w-8 text-white" />,
      title: "Donation Day",
      description: "Relax as our professional staff guide you through the donation process. It only takes about 15-30 minutes."
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Post-Donation",
      description: "Enjoy refreshments while your donation is processed. Track your impact through our donor dashboard."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#36454F] to-[#000000]">
      <div className="container mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
        >
          How Donation Works
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Our streamlined process makes donating blood simple, safe, and rewarding
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ProcessStep 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-2xl font-bold text-red-500 mb-4">It takes only an hour</p>
          <p className="text-xl text-white">Donate blood, save lives!</p>
        </motion.div>
      </div>
    </section>
  );
}