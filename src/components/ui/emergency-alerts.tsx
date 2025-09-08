'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Users, Clock, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type EmergencyEvent = {
  id: string;
  type: string;
  location: string;
  bloodTypesNeeded: string[];
  timeRemaining: number;
  donorsNotified: number;
  donorsResponded: number;
  status: 'active' | 'resolved';
};

const EmergencyAlerts = () => {
  const [activeEmergency, setActiveEmergency] = useState<EmergencyEvent | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Mass Casualty',
    location: 'Downtown Medical Center',
    bloodTypes: ['O-', 'O+', 'A-'],
  });
  const [countdown, setCountdown] = useState(60);
  
  // Simulate countdown for active emergency
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeEmergency && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeEmergency, countdown]);
  
  // Simulate donor responses over time
  useEffect(() => {
    let responseTimer: NodeJS.Timeout;
    if (activeEmergency && activeEmergency.donorsResponded < activeEmergency.donorsNotified) {
      responseTimer = setInterval(() => {
        setActiveEmergency(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            donorsResponded: Math.min(prev.donorsResponded + 1, prev.donorsNotified)
          };
        });
      }, 3000);
    }
    return () => clearInterval(responseTimer);
  }, [activeEmergency]);
  
  const handleCreateEmergency = () => {
    const newEmergency: EmergencyEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: formData.type,
      location: formData.location,
      bloodTypesNeeded: formData.bloodTypes,
      timeRemaining: 60, // 60 minutes
      donorsNotified: Math.floor(Math.random() * 20) + 30, // Random number between 30-50
      donorsResponded: 0,
      status: 'active',
    };
    
    setActiveEmergency(newEmergency);
    setShowCreateForm(false);
    setCountdown(60);
    
    // Log to console (simulating notification system)
    console.log(`EMERGENCY ALERT: ${newEmergency.type} at ${newEmergency.location}. Notifying ${newEmergency.donorsNotified} potential donors for blood types: ${newEmergency.bloodTypesNeeded.join(', ')}`);
  };
  
  const resolveEmergency = () => {
    setActiveEmergency(prev => prev ? { ...prev, status: 'resolved' } : null);
  };
  
  const resetDemo = () => {
    setActiveEmergency(null);
    setShowCreateForm(false);
    setCountdown(60);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <AlertTriangle className="text-red-400" />
          Emergency Response Alerts
        </CardTitle>
        <CardDescription className="text-white/80">
          Rapid response system for critical blood donation needs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {activeEmergency ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {activeEmergency.status === 'active' ? (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <AlertTitle className="text-red-400 font-bold text-lg flex items-center gap-2">
                  ACTIVE EMERGENCY
                  <span className="animate-pulse inline-block h-3 w-3 rounded-full bg-red-500"></span>
                </AlertTitle>
                <AlertDescription className="text-white">
                  {activeEmergency.type} at {activeEmergency.location}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-500/20 border-green-500/50">
                <Bell className="h-5 w-5 text-green-400" />
                <AlertTitle className="text-green-400 font-bold text-lg">
                  EMERGENCY RESOLVED
                </AlertTitle>
                <AlertDescription className="text-white">
                  {activeEmergency.type} at {activeEmergency.location} has been resolved
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <MapPin className="text-red-400" />
                  Emergency Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Type:</span>
                    <span className="font-medium">{activeEmergency.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Location:</span>
                    <span className="font-medium">{activeEmergency.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Blood Types Needed:</span>
                    <span className="font-medium">
                      {activeEmergency.bloodTypesNeeded.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Status:</span>
                    <span className={`font-medium ${activeEmergency.status === 'active' ? 'text-red-400' : 'text-green-400'}`}>
                      {activeEmergency.status === 'active' ? 'ACTIVE' : 'RESOLVED'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Clock className="text-yellow-400" />
                  Response Metrics
                </h3>
                <div className="space-y-3">
                  {activeEmergency.status === 'active' && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Time Remaining:</span>
                      <span className="font-bold text-xl text-red-400">{countdown} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/70">Donors Notified:</span>
                    <span className="font-medium">{activeEmergency.donorsNotified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Donors Responded:</span>
                    <span className="font-medium">{activeEmergency.donorsResponded}</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-white/70 mb-1 flex justify-between">
                      <span>Response Rate:</span>
                      <span>{Math.round((activeEmergency.donorsResponded / activeEmergency.donorsNotified) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(activeEmergency.donorsResponded / activeEmergency.donorsNotified) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
              {activeEmergency.status === 'active' ? (
                <Button 
                  onClick={resolveEmergency}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Resolved
                </Button>
              ) : (
                <Button 
                  onClick={resetDemo}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reset Demo
                </Button>
              )}
            </div>
          </motion.div>
        ) : showCreateForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-medium">Create Emergency Alert</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="emergencyType" className="block text-sm font-medium">
                  Emergency Type
                </label>
                <select
                  id="emergencyType"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="Mass Casualty">Mass Casualty</option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Multiple Trauma">Multiple Trauma</option>
                  <option value="Surgical Emergency">Surgical Emergency</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">
                  Hospital Location
                </label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="Downtown Medical Center">Downtown Medical Center</option>
                  <option value="Westside Hospital">Westside Hospital</option>
                  <option value="North County Medical">North County Medical</option>
                  <option value="University Hospital">University Hospital</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Blood Types Needed
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`blood-${type}`}
                        checked={formData.bloodTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, bloodTypes: [...formData.bloodTypes, type]});
                          } else {
                            setFormData({...formData, bloodTypes: formData.bloodTypes.filter(t => t !== type)});
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`blood-${type}`}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
              <Button 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEmergency}
                className="bg-red-600 hover:bg-red-700"
                disabled={formData.bloodTypes.length === 0}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Activate Emergency Alert
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="bg-white/5 inline-block p-6 rounded-full mb-6">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-medium mb-4">No Active Emergencies</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              The emergency alert system allows hospitals to quickly notify nearby eligible donors during critical situations.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Simulate Emergency Alert
            </Button>
          </motion.div>
        )}
        
        {/* Geo-fence Visualization */}
        {activeEmergency && activeEmergency.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 p-4 rounded-lg mt-6"
          >
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Users className="text-blue-400" />
              Donor Geo-fence (5 mile radius)
            </h3>
            <div className="relative h-48 bg-slate-800 rounded-lg overflow-hidden">
              {/* Simplified map visualization */}
              <div className="absolute inset-0 opacity-70 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
              
              {/* Hospital marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-red-500 p-2 rounded-full animate-pulse">
                  <Hospital className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* Geo-fence circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-red-500/70 bg-red-500/20 animate-ping opacity-70"></div>
              
              {/* Donor markers */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = Math.random() * 60 + 20;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                return (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full"
                    style={{ 
                      top: `calc(50% + ${y}px)`, 
                      left: `calc(50% + ${x}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                );
              })}
            </div>
            <p className="text-xs text-white/60 mt-2 text-center">
              Simplified visualization - actual system uses precise GPS coordinates
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyAlerts;