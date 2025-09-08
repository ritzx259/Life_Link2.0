'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart4, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

type BloodTypeData = {
  name: string;
  current: number;
  predicted: number;
  fill: string;
};

type TimeSeriesData = {
  date: string;
  actual: number;
  predicted: number;
};

const PredictiveForecasting = () => {
  const [activeTab, setActiveTab] = useState<'demand' | 'supply'>('demand');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  // Mock data for blood type demand
  const bloodTypeData: BloodTypeData[] = [
    { name: 'A+', current: 120, predicted: 145, fill: '#FF6384' },
    { name: 'A-', current: 40, predicted: 35, fill: '#36A2EB' },
    { name: 'B+', current: 80, predicted: 95, fill: '#FFCE56' },
    { name: 'B-', current: 25, predicted: 30, fill: '#4BC0C0' },
    { name: 'AB+', current: 30, predicted: 25, fill: '#9966FF' },
    { name: 'AB-', current: 10, predicted: 15, fill: '#FF9F40' },
    { name: 'O+', current: 150, predicted: 180, fill: '#8AC926' },
    { name: 'O-', current: 45, predicted: 60, fill: '#1982C4' },
  ];
  
  // Mock time series data
  const generateTimeSeriesData = (): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    const numberOfPoints = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    
    for (let i = 0; i < numberOfPoints; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (numberOfPoints - i));
      
      // Generate some realistic looking data with trends
      const baseValue = activeTab === 'demand' ? 100 : 80;
      const variance = Math.sin(i / 5) * 15;
      const trend = i * (0.5 + Math.random() * 0.2);
      const randomness = Math.random() * 10 - 5;
      
      const actual = Math.max(0, Math.round(baseValue + variance + randomness));
      const predicted = Math.max(0, Math.round(actual + trend / 3 + Math.random() * 15 - 5));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual,
        predicted: i > numberOfPoints - 8 ? predicted : 0, // Only show predictions for future dates
      });
    }
    
    return data;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <BarChart4 className="text-blue-400" />
          Predictive Demand Forecasting
        </CardTitle>
        <CardDescription className="text-white/80">
          AI-powered predictions for blood supply and demand
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'demand' ? 'default' : 'outline'}
            onClick={() => setActiveTab('demand')}
            className={activeTab === 'demand' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 hover:bg-white/20'}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Demand Forecast
          </Button>
          <Button
            variant={activeTab === 'supply' ? 'default' : 'outline'}
            onClick={() => setActiveTab('supply')}
            className={activeTab === 'supply' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 hover:bg-white/20'}
          >
            <BarChart4 className="mr-2 h-4 w-4" />
            Supply Forecast
          </Button>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/70">Time Range:</span>
          <div className="flex bg-white/10 rounded-md p-1">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-white/20' : ''}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-white/20' : ''}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'quarter' ? 'bg-white/20' : ''}`}
            >
              Quarter
            </button>
          </div>
        </div>
        
        {/* Time Series Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            {activeTab === 'demand' ? 'Blood Demand Over Time' : 'Blood Supply Over Time'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    color: 'white'
                  }} 
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#4BC0C0" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#4BC0C0' }} 
                  activeDot={{ r: 5 }} 
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#FF6384" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: '#FF6384' }} 
                  activeDot={{ r: 5 }} 
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Blood Type Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-4">
            {activeTab === 'demand' ? 'Predicted vs Current Demand by Blood Type' : 'Predicted vs Current Supply by Blood Type'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodTypeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    color: 'white'
                  }} 
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
                />
                <Bar 
                  dataKey="current" 
                  name="Current" 
                  fill="#36A2EB" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="predicted" 
                  name="Predicted" 
                  fill="#FF6384" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-blue-500/20 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            AI-Generated Insights
          </h3>
          <ul className="space-y-2 text-white/90">
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 rounded-full p-1 mt-0.5">
                <Check className="h-3 w-3 text-white" />
              </span>
              {activeTab === 'demand' ? 
                'Predicted 20% increase in O+ demand over the next 2 weeks' : 
                'Current O- supply is 25% below optimal levels'}
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 rounded-full p-1 mt-0.5">
                <Check className="h-3 w-3 text-white" />
              </span>
              {activeTab === 'demand' ? 
                'AB- demand expected to remain stable' : 
                'A+ supply trending upward, will meet demand within 5 days'}
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 rounded-full p-1 mt-0.5">
                <Check className="h-3 w-3 text-white" />
              </span>
              {activeTab === 'demand' ? 
                'Seasonal increase in demand expected for all types in Q4' : 
                'Recommended: Focus donor recruitment on B- and O- types'}
            </li>
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PredictiveForecasting;