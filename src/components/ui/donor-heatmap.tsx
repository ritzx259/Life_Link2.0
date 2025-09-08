'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp } from 'lucide-react';

// Mock data for donor density in different areas
const mockHeatmapData = [
  { id: 1, area: 'Downtown', lat: 40.7589, lng: -73.9851, density: 85, donors: 342, color: '#ef4444' },
  { id: 2, area: 'Midtown', lat: 40.7505, lng: -73.9934, density: 92, donors: 428, color: '#dc2626' },
  { id: 3, area: 'Upper East Side', lat: 40.7736, lng: -73.9566, density: 78, donors: 298, color: '#f97316' },
  { id: 4, area: 'Brooklyn Heights', lat: 40.6962, lng: -73.9969, density: 65, donors: 234, color: '#eab308' },
  { id: 5, area: 'Queens', lat: 40.7282, lng: -73.7949, density: 58, donors: 189, color: '#22c55e' },
  { id: 6, area: 'Bronx', lat: 40.8448, lng: -73.8648, density: 45, donors: 156, color: '#3b82f6' },
  { id: 7, area: 'Staten Island', lat: 40.5795, lng: -74.1502, density: 38, donors: 98, color: '#8b5cf6' },
  { id: 8, area: 'Financial District', lat: 40.7074, lng: -74.0113, density: 72, donors: 267, color: '#f59e0b' },
];

const DonorHeatmap = () => {
  const [selectedArea, setSelectedArea] = useState<typeof mockHeatmapData[0] | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density: number) => {
    if (density >= 80) return '#ef4444'; // High density - Red
    if (density >= 60) return '#f97316'; // Medium-high - Orange
    if (density >= 40) return '#eab308'; // Medium - Yellow
    return '#22c55e'; // Low - Green
  };

  const maxDensity = Math.max(...mockHeatmapData.map(d => d.density));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <MapPin className="text-red-500" />
          Donor Density Heatmap
        </h2>
        <p className="text-gray-600">
          Real-time visualization of donor availability across different areas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2">
          <div className="relative bg-gray-100 rounded-lg p-4 h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>
            
            {/* Simulated Map Grid */}
            <div className="relative h-full grid grid-cols-8 grid-rows-6 gap-1">
              {mockHeatmapData.map((area, index) => {
                const size = (area.density / maxDensity) * 100;
                const gridCol = (index % 4) + 2;
                const gridRow = Math.floor(index / 4) + 2;
                
                return (
                  <motion.div
                    key={`${area.id}-${animationKey}`}
                    className="relative cursor-pointer"
                    style={{
                      gridColumn: gridCol,
                      gridRow: gridRow,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    onClick={() => setSelectedArea(area)}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg"
                      style={{
                        backgroundColor: getDensityColor(area.density),
                        width: `${Math.max(size * 0.6, 30)}px`,
                        height: `${Math.max(size * 0.6, 30)}px`,
                      }}
                    >
                      {area.density}%
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                      {area.area}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-md">
              <h4 className="text-sm font-semibold mb-2">Density Scale</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">80%+ High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs">60-79% Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">40-59% Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Below 40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Area Details Panel */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="text-blue-500" />
              Area Statistics
            </h3>
            
            {selectedArea ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div>
                  <h4 className="font-medium text-lg text-gray-800">{selectedArea.area}</h4>
                  <p className="text-sm text-gray-600">Selected Area</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-500">{selectedArea.density}%</div>
                    <div className="text-xs text-gray-600">Density</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-500">{selectedArea.donors}</div>
                    <div className="text-xs text-gray-600">Active Donors</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-500 w-4 h-4" />
                    <span className="text-sm font-medium">Trend</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedArea.density > 70 ? 'High availability' : 
                     selectedArea.density > 50 ? 'Moderate availability' : 'Low availability'}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on an area to view details</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Areas</span>
                <span className="font-medium">{mockHeatmapData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Density</span>
                <span className="font-medium">
                  {Math.round(mockHeatmapData.reduce((acc, area) => acc + area.density, 0) / mockHeatmapData.length)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Donors</span>
                <span className="font-medium">
                  {mockHeatmapData.reduce((acc, area) => acc + area.donors, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorHeatmap;