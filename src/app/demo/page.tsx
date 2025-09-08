'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonorRegistrationForm from '@/components/ui/donor-registration-form';
import HospitalMatching from '@/components/ui/hospital-matching';
import PredictiveForecasting from '@/components/ui/predictive-forecasting';
import EmergencyAlerts from '@/components/ui/emergency-alerts';

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience our AI-powered donor health and hospital matching system in action.
          Explore each feature to see how we're revolutionizing blood donation.
        </p>
      </motion.div>

      <Tabs defaultValue="donor" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="donor">Donor Registration</TabsTrigger>
          <TabsTrigger value="hospital">Hospital Matching</TabsTrigger>
          <TabsTrigger value="forecasting">Predictive Forecasting</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donor" className="mt-6">
          <DonorRegistrationForm />
        </TabsContent>
        
        <TabsContent value="hospital" className="mt-6">
          <HospitalMatching />
        </TabsContent>
        
        <TabsContent value="forecasting" className="mt-6">
          <PredictiveForecasting />
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-6">
          <EmergencyAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
}