'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DonorFormData = {
  name: string;
  age: string;
  weight: string;
  bloodType: string;
  location: string;
  recentIllness: boolean;
};

const DonorRegistrationForm = () => {
  const [formData, setFormData] = useState<DonorFormData>({
    name: '',
    age: '',
    weight: '',
    bloodType: '',
    location: '',
    recentIllness: false,
  });
  
  const [eligibilityScore, setEligibilityScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const calculateEligibility = () => {
    let score = 0;
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    
    // Age criteria (18-65 is ideal)
    if (age >= 18 && age <= 65) {
      score += 40;
    } else if (age > 65 && age <= 75) {
      score += 20;
    } else {
      score += 0; // Not eligible if under 18 or over 75
    }
    
    // Weight criteria (>50kg is ideal)
    if (weight >= 50) {
      score += 30;
    } else if (weight >= 45) {
      score += 15;
    } else {
      score += 0; // Not eligible if under 45kg
    }
    
    // Recent illness
    if (!formData.recentIllness) {
      score += 30;
    }
    
    return score;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateEligibility();
    setEligibilityScore(score);
    setIsSubmitted(true);
  };
  
  const getEligibilityStatus = () => {
    if (eligibilityScore === null) return '';
    if (eligibilityScore >= 70) return 'Eligible';
    if (eligibilityScore >= 50) return 'Conditionally Eligible';
    return 'Not Eligible';
  };
  
  const getEligibilityColor = () => {
    if (eligibilityScore === null) return '';
    if (eligibilityScore >= 70) return 'bg-green-500';
    if (eligibilityScore >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      weight: '',
      bloodType: '',
      location: '',
      recentIllness: false,
    });
    setEligibilityScore(null);
    setIsSubmitted(false);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Donor Registration</CardTitle>
        <CardDescription className="text-white/80">
          Register as a donor and check your eligibility score
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="16"
                  max="100"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="40"
                  max="200"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                required
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="" disabled>Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, State"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="recentIllness"
                name="recentIllness"
                checked={formData.recentIllness}
                onChange={handleChange}
                className="rounded-sm"
              />
              <Label htmlFor="recentIllness" className="text-sm font-normal">
                I have had an illness or medical procedure in the last 14 days
              </Label>
            </div>
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 mt-4">
              Check Eligibility
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: getEligibilityColor() }}>
                {eligibilityScore! >= 70 ? (
                  <Check size={40} className="text-white" />
                ) : eligibilityScore! >= 50 ? (
                  <Check size={40} className="text-white" />
                ) : (
                  <X size={40} className="text-white" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{getEligibilityStatus()}</h3>
              <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                <div 
                  className={`h-4 rounded-full ${getEligibilityColor()}`}
                  style={{ width: `${eligibilityScore}%` }}
                ></div>
              </div>
              <p className="text-lg font-medium">Score: {eligibilityScore}/100</p>
            </div>
            
            <Alert className={`border-none ${eligibilityScore! >= 70 ? 'bg-green-500/20' : eligibilityScore! >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
              <AlertTitle>
                {eligibilityScore! >= 70 ? 'You are eligible to donate!' : 
                 eligibilityScore! >= 50 ? 'You may be eligible with additional screening' : 
                 'You are not eligible at this time'}
              </AlertTitle>
              <AlertDescription>
                {eligibilityScore! >= 70 ? (
                  'Thank you for registering! Your information has been saved and you will be notified when donation opportunities arise in your area.'
                ) : eligibilityScore! >= 50 ? (
                  'You may be eligible to donate with additional medical screening. Please contact your local donation center for more information.'
                ) : (
                  'Based on the information provided, you are not eligible to donate at this time. Please check back after 14 days or when your health status changes.'
                )}
              </AlertDescription>
            </Alert>
            
            <div className="pt-4">
              <Button onClick={resetForm} className="w-full bg-white/20 hover:bg-white/30">
                Register Another Donor
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorRegistrationForm;