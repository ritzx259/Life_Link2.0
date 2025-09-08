'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hospital, User, MapPin, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type MatchedDonor = {
  id: string;
  name: string;
  bloodType: string;
  distance: number;
  responseTime: number;
  matchScore: number;
};

const HospitalMatching = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedDonors, setMatchedDonors] = useState<MatchedDonor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<MatchedDonor | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API key validation
    if (apiKey.length > 5) {
      setIsLoggedIn(true);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for matched donors
      const mockDonors: MatchedDonor[] = [
        {
          id: '1',
          name: 'John D.',
          bloodType,
          distance: 2.4,
          responseTime: 15,
          matchScore: 98,
        },
        {
          id: '2',
          name: 'Sarah M.',
          bloodType,
          distance: 3.7,
          responseTime: 20,
          matchScore: 92,
        },
        {
          id: '3',
          name: 'Robert K.',
          bloodType,
          distance: 5.1,
          responseTime: 25,
          matchScore: 87,
        },
        {
          id: '4',
          name: 'Emily L.',
          bloodType,
          distance: 6.8,
          responseTime: 30,
          matchScore: 82,
        },
      ];
      
      setMatchedDonors(mockDonors);
      setIsSearching(false);
    }, 2000);
  };
  
  const handleSelectDonor = (donor: MatchedDonor) => {
    setSelectedDonor(donor);
  };
  
  const handleNotify = () => {
    // Simulate notification
    setTimeout(() => {
      setIsNotified(true);
      // Log to console (simulating email/SMS notification)
      console.log(`Notification sent to donor ${selectedDonor?.name} for ${bloodType} blood donation`);
    }, 1500);
  };
  
  const resetSearch = () => {
    setBloodType('');
    setUrgency('normal');
    setMatchedDonors([]);
    setSelectedDonor(null);
    setIsNotified(false);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hospital className="text-red-400" />
          Hospital Donor Matching
        </CardTitle>
        <CardDescription className="text-white/80">
          Find and connect with eligible donors in your area
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apiKey" className="block text-sm font-medium">
                  Hospital API Key
                </label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your hospital API key"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
                <p className="text-xs text-white/60">
                  For demo purposes, enter any value with more than 5 characters
                </p>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login as Hospital
              </Button>
            </form>
          </motion.div>
        ) : selectedDonor ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <User className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{selectedDonor.name}</h3>
                  <p className="text-white/70">Blood Type: {selectedDonor.bloodType}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{selectedDonor.matchScore}%</div>
                <p className="text-white/70">Match Score</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg flex items-center gap-3">
                <MapPin className="text-red-400" />
                <div>
                  <p className="text-sm text-white/70">Distance</p>
                  <p className="font-medium">{selectedDonor.distance} miles away</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg flex items-center gap-3">
                <Clock className="text-yellow-400" />
                <div>
                  <p className="text-sm text-white/70">Est. Response Time</p>
                  <p className="font-medium">{selectedDonor.responseTime} minutes</p>
                </div>
              </div>
            </div>
            
            {!isNotified ? (
              <Button 
                onClick={handleNotify} 
                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Hospital size={18} />
                Notify Donor
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 p-4 rounded-lg text-center"
              >
                <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <Check className="text-white" />
                </div>
                <h3 className="text-xl font-medium mb-1">Donor Notified Successfully!</h3>
                <p className="text-white/70 mb-4">
                  {selectedDonor.name} has been notified about the donation request.
                  They will confirm availability shortly.
                </p>
                <Button 
                  onClick={resetSearch} 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                >
                  Start New Search
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : matchedDonors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-medium">Matched Donors ({matchedDonors.length})</h3>
            <div className="space-y-3">
              {matchedDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleSelectDonor(donor)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <User className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">{donor.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {donor.distance} miles
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {donor.responseTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{donor.matchScore}%</div>
                    <p className="text-xs text-white/70">Match Score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bloodType" className="block text-sm font-medium">
                  Required Blood Type
                </label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                  required
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
                <label htmlFor="urgency" className="block text-sm font-medium">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="low">Low - Within 24 hours</option>
                  <option value="normal">Normal - Within 6 hours</option>
                  <option value="high">High - Within 1 hour</option>
                  <option value="critical">Critical - Immediate</option>
                </select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSearching}
              >
                {isSearching ? 'Searching for Donors...' : 'Find Matching Donors'}
              </Button>
            </form>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default HospitalMatching;