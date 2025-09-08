'use client';

import { motion } from 'framer-motion';
import { Heart, Hospital, Activity, AlertTriangle, BarChart4 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="w-full"
    >
      <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
        <CardHeader>
          <div className="bg-white/20 w-fit p-3 rounded-lg mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-white/80">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/70">
            Click to explore this feature in our interactive demo
          </p>
        </CardContent>
        <CardFooter>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="text-white bg-white/20 px-4 py-2 rounded-md w-full"
          >
            Learn More
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart size={24} className="text-white" />,
      title: "Donor Health & Eligibility Scoring",
      description: "AI-powered health assessment and eligibility scoring for potential donors based on medical history and current health status.",
      delay: 0.1
    },
    {
      icon: <Hospital size={24} className="text-white" />,
      title: "Hospital Donor Matching",
      description: "Intelligent matching system that connects hospitals with the most suitable donors based on location, blood type, and availability.",
      delay: 0.3
    },
    {
      icon: <BarChart4 size={24} className="text-white" />,
      title: "Predictive Demand Forecasting",
      description: "Advanced analytics to predict blood and organ demand, helping hospitals prepare for future needs and optimize resource allocation.",
      delay: 0.5
    },
    {
      icon: <AlertTriangle size={24} className="text-white" />,
      title: "Emergency Response Alerts",
      description: "Real-time emergency alerts system that notifies nearby eligible donors during critical situations requiring immediate donations.",
      delay: 0.7
    }
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Features</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Revolutionizing healthcare with AI-powered donor matching and predictive analytics
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;