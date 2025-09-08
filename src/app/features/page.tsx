'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Hospital, TrendingUp, AlertTriangle, Clock, Users, Shield, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Our Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how our AI-powered platform is transforming blood donation and hospital matching
          with these innovative features.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <Heart className="h-10 w-10 text-red-500 mb-2" />
              <CardTitle>Donor Health & Eligibility Scoring</CardTitle>
              <CardDescription>
                AI-powered assessment of donor eligibility based on health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive health assessment using multiple factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time eligibility scoring with instant feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Personalized recommendations for improving donor health</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <Hospital className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Hospital Donor Matching</CardTitle>
              <CardDescription>
                Smart matching algorithm connects hospitals with eligible donors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Reduced response time for critical blood needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Geo-location based matching for proximity optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Blood type and compatibility verification system</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>Predictive Demand Forecasting</CardTitle>
              <CardDescription>
                AI-driven analytics to predict blood supply needs before shortages occur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Machine learning models analyze historical donation patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Seasonal and event-based demand prediction</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Proactive donor mobilization before shortages occur</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <CardTitle>Emergency Response Alerts</CardTitle>
              <CardDescription>
                Rapid response system for critical blood shortages and emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Instant notification system for eligible donors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Geo-fenced alerts target donors in proximity to need</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time tracking of emergency response metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center"
      >
        <a 
          href="/demo" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Try Interactive Demo
        </a>
      </motion.div>
    </div>
  );
}