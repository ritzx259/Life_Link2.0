'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

// Mock data for blood shortage and demand
const bloodTypeData = [
  { type: 'O+', shortage: 85, demand: 120, color: '#ef4444' },
  { type: 'A+', shortage: 65, demand: 95, color: '#f97316' },
  { type: 'B+', shortage: 45, demand: 70, color: '#eab308' },
  { type: 'AB+', shortage: 25, demand: 40, color: '#22c55e' },
  { type: 'O-', shortage: 95, demand: 110, color: '#dc2626' },
  { type: 'A-', shortage: 55, demand: 80, color: '#f59e0b' },
  { type: 'B-', shortage: 35, demand: 55, color: '#84cc16' },
  { type: 'AB-', shortage: 15, demand: 25, color: '#10b981' },
];

const monthlyTrends = [
  { month: 'Jan', shortage: 320, demand: 450 },
  { month: 'Feb', shortage: 280, demand: 420 },
  { month: 'Mar', shortage: 350, demand: 480 },
  { month: 'Apr', shortage: 290, demand: 440 },
  { month: 'May', shortage: 310, demand: 460 },
  { month: 'Jun', shortage: 340, demand: 490 },
];

const ShortageAndDemandGraph = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<typeof bloodTypeData[0] | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getUrgencyLevel = (shortage: number, demand: number) => {
    const ratio = shortage / demand;
    if (ratio > 0.8) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (ratio > 0.6) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (ratio > 0.4) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const maxValue = Math.max(...bloodTypeData.map(d => Math.max(d.shortage, d.demand)));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Activity className="text-red-500" />
          Blood Shortage & Demand Analysis
        </h2>
        <p className="text-gray-600">
          Real-time monitoring of blood supply shortages and demand across different blood types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Blood Type Shortage vs Demand</h3>
            
            <div className="space-y-4">
              {bloodTypeData.map((bloodType, index) => {
                const shortageHeight = (bloodType.shortage / maxValue) * 100;
                const demandHeight = (bloodType.demand / maxValue) * 100;
                const urgency = getUrgencyLevel(bloodType.shortage, bloodType.demand);
                
                return (
                  <motion.div
                    key={`${bloodType.type}-${animationKey}`}
                    className="cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedBloodType(bloodType)}
                  >
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white transition-colors">
                      <div className="w-12 text-center">
                        <span className="font-bold text-lg">{bloodType.type}</span>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-4">
                        {/* Shortage Bar */}
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-red-600">Shortage</span>
                            <span className="font-medium">{bloodType.shortage} units</span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-red-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${shortageHeight}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            />
                          </div>
                        </div>
                        
                        {/* Demand Bar */}
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-600">Demand</span>
                            <span className="font-bold text-lg text-black">{bloodType.type}</span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${demandHeight}%` }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${urgency.bg} ${urgency.color}`}>
                        {urgency.level}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-4">6-Month Trend</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {monthlyTrends.map((month, index) => {
                const shortageHeight = (month.shortage / 500) * 100;
                const demandHeight = (month.demand / 500) * 100;
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-end gap-1 h-24">
                      <motion.div
                        className="w-3 bg-red-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${shortageHeight}%` }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      />
                      <motion.div
                        className="w-3 bg-blue-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${demandHeight}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{month.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-xs">Shortage</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-xs">Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" />
              Blood Type Details
            </h3>
            
            {selectedBloodType ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div>
                  <h4 className="font-medium text-2xl text-gray-800">{selectedBloodType.type}</h4>
                  <p className="text-sm text-gray-600">Blood Type</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="text-red-500 w-4 h-4" />
                      <span className="text-sm font-medium">Current Shortage</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">{selectedBloodType.shortage}</div>
                    <div className="text-xs text-gray-600">units needed</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="text-blue-500 w-4 h-4" />
                      <span className="text-sm font-medium">Total Demand</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-500">{selectedBloodType.demand}</div>
                    <div className="text-xs text-gray-600">units required</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Urgency Level</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getUrgencyLevel(selectedBloodType.shortage, selectedBloodType.demand).bg
                  } ${
                    getUrgencyLevel(selectedBloodType.shortage, selectedBloodType.demand).color
                  }`}>
                    {getUrgencyLevel(selectedBloodType.shortage, selectedBloodType.demand).level}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on a blood type to view details</p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Shortage</span>
                <span className="font-medium text-red-600">
                  {bloodTypeData.reduce((acc, type) => acc + type.shortage, 0)} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Demand</span>
                <span className="font-medium text-blue-600">
                  {bloodTypeData.reduce((acc, type) => acc + type.demand, 0)} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Critical Types</span>
                <span className="font-medium text-orange-600">
                  {bloodTypeData.filter(type => getUrgencyLevel(type.shortage, type.demand).level === 'Critical').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortageAndDemandGraph;