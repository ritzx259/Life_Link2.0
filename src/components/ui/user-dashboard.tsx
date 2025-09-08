'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Activity, Droplet, AlertTriangle, CheckCircle, BarChart, Bell, Heart, Award, TrendingUp, Users, Search, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Define interfaces for type safety
interface NearbyDrive {
  id: number;
  name: string;
  date: string;
  distance: string;
}

interface Badge {
  id?: number;
  name: string;
}

interface DonationHistoryItem {
  date: string;
  location: string;
  bloodVolume: string;
  status: string;
}

interface ImpactStats {
  livesSaved: number;
  hospitalsHelped: number;
  totalBloodVolume: string;
  donorRank: string;
  percentile: number;
}

interface Appointment {
  date: string;
  time: string;
  location: string;
  address: string;
  confirmationCode: string;
}

interface DonorData {
  name: string;
  bloodType: string;
  lastDonation: string;
  donationCount: number;
  eligibleToDonateDays: number;
  nextEligibleDate: string;
  donationStreak: number;
  badges: string[];
  upcomingAppointment?: Appointment;
  donationHistory: DonationHistoryItem[];
  impactStats: ImpactStats;
  nearbyDrives: NearbyDrive[];
}

interface BloodInventoryItem {
  units: number;
  demand: string;
  capacity: number;
  expiringUnits: number;
}

interface EmergencyAlert {
  type: string;
  message: string;
  date: string;
  createdAt: string;
}

interface UpcomingDonation {
  id: number;
  date: string;
  time: string;
  donorName: string;
  bloodType: string;
  status: string;
  firstTime: boolean;
}

interface RecentActivity {
  id: number;
  action: string;
  bloodType: string;
  quantity: string | null;
  timestamp: string;
}

interface MonthlyStat {
  month: string;
  donations: number;
  usage: number;
}

interface HospitalData {
  name: string;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  stats: {
    donorsThisMonth: number;
    bloodCollectedL: number;
    patientsHelped: number;
    donationGrowth: number;
  };
  bloodInventory: Record<string, BloodInventoryItem>;
  upcomingDonations: UpcomingDonation[];
  emergencyAlerts: EmergencyAlert[];
  recentActivity: RecentActivity[];
  monthlyStats: MonthlyStat[];
}

interface Notification {
  id: string;
  message: string;
  type: string;
}

interface UserDashboardProps {
  userType: 'donor' | 'hospital';
  userData?: DonorData | HospitalData;
}

// Logout function to be used in both dashboards
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Redirect to home page after logout
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const DonorDashboard = ({ userData }: { userData?: DonorData }) => {
  const [activeView, setActiveView] = useState<'overview' | 'appointments' | 'history' | 'impact'>('overview');
  const [isMapVisible, setIsMapVisible] = useState(false);
  
  // Mock data for demonstration
  const donorData: DonorData = userData || {
    name: 'John Donor',
    bloodType: 'O+',
    lastDonation: '2023-10-15',
    donationCount: 5,
    eligibleToDonateDays: 0,
    nextEligibleDate: '2024-07-15',
    donationStreak: 3,
    badges: ['First Time Donor', 'Regular Donor', 'Life Saver'],
    upcomingAppointment: {
      date: '2024-07-15',
      time: '10:00 AM',
      location: 'Memorial Hospital',
      address: '123 Medical Ave, City',
      confirmationCode: 'DON-12345'
    },
    donationHistory: [
      { date: '2023-10-15', location: 'City General Hospital', bloodVolume: '450 ml', status: 'completed' },
      { date: '2023-07-20', location: 'Memorial Hospital', bloodVolume: '450 ml', status: 'completed' },
      { date: '2023-04-05', location: 'University Medical Center', bloodVolume: '450 ml', status: 'completed' },
      { date: '2023-01-12', location: 'Memorial Hospital', bloodVolume: '450 ml', status: 'completed' },
      { date: '2022-10-30', location: 'City General Hospital', bloodVolume: '450 ml', status: 'completed' }
    ],
    impactStats: {
      livesSaved: 15,
      hospitalsHelped: 3,
      totalBloodVolume: '2250 ml',
      donorRank: 'Gold',
      percentile: 85
    },
    nearbyDrives: [
      { id: 1, name: 'Community Blood Drive', date: '2024-07-20', distance: '0.8 miles' },
      { id: 2, name: 'University Hospital Drive', date: '2024-07-25', distance: '1.2 miles' },
      { id: 3, name: 'Corporate Blood Drive', date: '2024-08-01', distance: '2.5 miles' }
    ]
  };

  const isEligible = donorData.eligibleToDonateDays <= 0;
  
  // Calculate donation progress
  const donationGoal = 6; // donations per year
  const donationProgress = (donorData.donationCount / donationGoal) * 100;

  // Navigation for donor dashboard views
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
    { id: 'impact', label: 'Your Impact', icon: <Heart className="w-4 h-4" /> },
  ];
  
  return (
    <div className="space-y-6">
      {/* Dashboard Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
        <div className="flex overflow-x-auto hide-scrollbar">
          {navItems?.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap mr-2 ${activeView === item.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Donor Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Donor Status</CardTitle>
              <CardDescription>Your current donation eligibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                    {donorData.bloodType}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Donation</p>
                    <p className="font-medium">{donorData.lastDonation}</p>
                    <p className="text-xs text-gray-500">{donorData.donationCount} total donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isEligible ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isEligible ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Eligible to Donate
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        Eligible in {donorData.eligibleToDonateDays} days
                      </>
                    )}
                  </div>
                  {!isEligible && (
                    <p className="text-xs text-gray-500 mt-1">Next eligible on {donorData.nextEligibleDate}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Yearly Donation Goal</span>
                  <span className="text-sm text-gray-500">{donorData.donationCount}/{donationGoal} donations</span>
                </div>
                <Progress value={donationProgress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700" disabled={!isEligible}>
                Schedule Donation
              </Button>
            </CardFooter>
          </Card>

          {/* Nearby Blood Drives */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Nearby Blood Drives</CardTitle>
              <CardDescription>Donation opportunities in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donorData.nearbyDrives?.map((drive: NearbyDrive) => (
                  <div key={drive.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium">{drive.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {drive.date}
                        <MapPin className="w-3 h-3 ml-2 mr-1" />
                        {drive.distance}
                      </div>
                    </div>
                    <Button size="sm">Sign Up</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Badges and Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Badges & Achievements</CardTitle>
              <CardDescription>Your donation milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {donorData.badges?.map((badge: string, index: number) => (
                  <div key={index} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full">
                    <Award className="w-4 h-4 mr-1.5 text-red-600" />
                    <span className="text-sm">{badge}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">Current streak: <span className="text-red-600">{donorData.donationStreak}</span> donations</p>
                <p className="text-xs text-gray-500 mt-1">Keep donating regularly to increase your streak!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Appointments View */}
      {activeView === 'appointments' && (
        <div className="space-y-6">
          {/* Upcoming Appointment */}
          {donorData.upcomingAppointment && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Appointment</CardTitle>
                <CardDescription>Your scheduled donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{donorData.upcomingAppointment.location}</h3>
                        <p className="text-sm text-gray-500">{donorData.upcomingAppointment.address}</p>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-md border text-sm">
                        Confirmation: <span className="font-medium">{donorData.upcomingAppointment.confirmationCode}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{donorData.upcomingAppointment.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{donorData.upcomingAppointment.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center" 
                      onClick={() => setIsMapVisible(!isMapVisible)}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {isMapVisible ? 'Hide Map' : 'Show Map'}
                    </Button>
                  </div>
                  
                  {isMapVisible && (
                    <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Map would be displayed here</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Preparation Tips</h4>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                      <li>Get a good night's sleep before your donation</li>
                      <li>Eat a healthy meal 2-3 hours before donating</li>
                      <li>Drink plenty of water before your appointment</li>
                      <li>Bring a valid ID and your donor card if you have one</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reschedule</Button>
                <Button variant="destructive">Cancel</Button>
              </CardFooter>
            </Card>
          )}

          {/* Schedule New Appointment */}
          {!donorData.upcomingAppointment && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Donation</CardTitle>
                <CardDescription>Find a convenient time and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search by location" 
                        className="pl-9 pr-4 py-2 w-full border rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      />
                    </div>
                    <Button className="rounded-l-none">Search</Button>
                  </div>
                  
                  <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                    <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="font-medium">No Appointment Scheduled</h3>
                    <p className="text-sm text-gray-500 mt-1">Search for donation centers or blood drives near you</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* History View */}
      {activeView === 'history' && (
        <div className="space-y-6">
          {/* Donation History */}
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>You've donated {donorData.donationCount} times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donorData.donationHistory?.map((donation: DonationHistoryItem, index: number) => (
                  <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Droplet className="w-4 h-4 mr-2 text-red-500" />
                      <div>
                        <p className="font-medium">{donation.location}</p>
                        <p className="text-sm text-gray-500">{donation.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">{donation.bloodVolume}</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{donation.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-dashed">
                <Button variant="outline" className="w-full">
                  Download Donation Certificate
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
      
      {/* Impact View */}
      {activeView === 'impact' && (
        <div className="space-y-6">
          {/* Impact Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>The difference you've made</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{donorData.impactStats.livesSaved}</p>
                  <p className="text-sm text-gray-500">Lives Saved</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{donorData.impactStats.hospitalsHelped}</p>
                  <p className="text-sm text-gray-500">Hospitals</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Droplet className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{donorData.impactStats.totalBloodVolume}</p>
                  <p className="text-sm text-gray-500">Blood Volume</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-600">{donorData.impactStats.donorRank}</p>
                  <p className="text-sm text-gray-500">Donor Rank</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Donor Percentile</span>
                  <span className="text-sm text-gray-500">Top {100 - donorData.impactStats.percentile}%</span>
                </div>
                <Progress value={donorData.impactStats.percentile} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">You donate more than {donorData.impactStats.percentile}% of donors</p>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="text-green-800 font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Your Donation Impact
                </h3>
                <p className="text-sm text-green-700 mt-1">Your donations have helped patients in 3 hospitals and potentially saved 15 lives. Each donation can save up to 3 lives!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const HospitalDashboard = ({ userData }: { userData?: HospitalData }) => {
  const [activeView, setActiveView] = useState<'overview' | 'inventory' | 'donors' | 'analytics'>('overview');
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  
  // Mock data for demonstration
  const hospitalData: HospitalData = userData || {
    name: 'Memorial Hospital',
    location: '123 Medical Ave',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'contact@memorialhospital.org',
      website: 'www.memorialhospital.org'
    },
    stats: {
      donorsThisMonth: 87,
      bloodCollectedL: 39.15,
      patientsHelped: 116,
      donationGrowth: 12.5
    },
    bloodInventory: {
      'A+': { units: 45, demand: 'high', capacity: 60, expiringUnits: 2 },
      'A-': { units: 12, demand: 'medium', capacity: 20, expiringUnits: 0 },
      'B+': { units: 23, demand: 'low', capacity: 30, expiringUnits: 1 },
      'B-': { units: 8, demand: 'high', capacity: 15, expiringUnits: 0 },
      'AB+': { units: 5, demand: 'low', capacity: 10, expiringUnits: 0 },
      'AB-': { units: 3, demand: 'critical', capacity: 10, expiringUnits: 0 },
      'O+': { units: 67, demand: 'medium', capacity: 80, expiringUnits: 3 },
      'O-': { units: 15, demand: 'critical', capacity: 30, expiringUnits: 0 },
    },
    upcomingDonations: [
      { id: 1, date: '2024-07-15', time: '10:00 AM', donorName: 'John D.', bloodType: 'O+', status: 'confirmed', firstTime: false },
      { id: 2, date: '2024-07-15', time: '11:30 AM', donorName: 'Sarah M.', bloodType: 'A-', status: 'confirmed', firstTime: true },
      { id: 3, date: '2024-07-16', time: '09:15 AM', donorName: 'Robert J.', bloodType: 'B+', status: 'pending', firstTime: false },
      { id: 4, date: '2024-07-16', time: '02:00 PM', donorName: 'Emily W.', bloodType: 'O-', status: 'confirmed', firstTime: true },
      { id: 5, date: '2024-07-17', time: '10:45 AM', donorName: 'Michael T.', bloodType: 'AB+', status: 'confirmed', firstTime: false },
    ],
    emergencyAlerts: [
      { type: 'O-', message: 'Critical shortage', date: '2024-07-14', createdAt: '2 hours ago' },
      { type: 'AB-', message: 'Low inventory', date: '2024-07-13', createdAt: '5 hours ago' },
    ],
    recentActivity: [
      { id: 1, action: 'Blood Donation Received', bloodType: 'O+', quantity: '450ml', timestamp: '1 hour ago' },
      { id: 2, action: 'Blood Units Dispatched', bloodType: 'A-', quantity: '2 units', timestamp: '3 hours ago' },
      { id: 3, action: 'Emergency Request Fulfilled', bloodType: 'B-', quantity: '1 unit', timestamp: '5 hours ago' },
      { id: 4, action: 'New Donor Registered', bloodType: 'AB+', quantity: null, timestamp: '6 hours ago' },
    ],
    monthlyStats: [
      { month: 'Jan', donations: 65, usage: 58 },
      { month: 'Feb', donations: 72, usage: 65 },
      { month: 'Mar', donations: 80, usage: 76 },
      { month: 'Apr', donations: 74, usage: 70 },
      { month: 'May', donations: 85, usage: 80 },
      { month: 'Jun', donations: 90, usage: 82 },
    ]
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Blood Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Inventory</CardTitle>
          <CardDescription>Current blood supply levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hospitalData.bloodInventory && Object.entries(hospitalData.bloodInventory).map(([type, info]: [string, BloodInventoryItem]) => (
              <div key={type} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold">{type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(info.demand)}`}>
                    {info.demand}
                  </span>
                </div>
                <p className="text-2xl font-bold">{info.units}</p>
                <p className="text-xs text-gray-500">units available</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Request Blood Donation</Button>
        </CardFooter>
      </Card>

      {/* Emergency Alerts */}
      {hospitalData.emergencyAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hospitalData.emergencyAlerts?.map((alert: EmergencyAlert, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {alert.type}
                    </div>
                    <span>{alert.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{alert.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700">Send Emergency Request</Button>
          </CardFooter>
        </Card>
      )}

      {/* Upcoming Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Donations</CardTitle>
          <CardDescription>Scheduled for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalData.upcomingDonations?.map((donation: UpcomingDonation, index: number) => (
              <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">{donation.donorName} <span className="text-red-600 font-bold">{donation.bloodType}</span></p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {donation.date}
                    <Clock className="w-3 h-3 ml-2 mr-1" />
                    {donation.time}
                  </div>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Appointments</Button>
        </CardFooter>
      </Card>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Analytics Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-gray-500">Blood supply trends and forecasting charts would appear here</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Full Analytics</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function UserDashboard({ userType = 'donor', userData }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(userType);
  const [notifications, setNotifications] = useState<Notification[]>([
    {id: '1', message: 'Your donation appointment is tomorrow', type: 'reminder'},
    {id: '2', message: 'New blood drive in your area', type: 'event'},
    {id: '3', message: 'Critical need for O- blood type', type: 'urgent'}
  ]);
  
  // Function to handle user logout
  const onLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await handleLogout();
    }
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Type guard functions to check userData type
  const isDonorData = (data: DonorData | HospitalData | undefined): data is DonorData => {
    return data !== undefined && 'bloodType' in data;
  };

  const isHospitalData = (data: DonorData | HospitalData | undefined): data is HospitalData => {
    return data !== undefined && 'bloodInventory' in data;
  };

  // Get blood type safely
  const getBloodType = () => {
    if (isDonorData(userData)) {
      return userData.bloodType;
    }
    return 'A+';
  };
  
  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-500">Welcome back, {userData?.name || 'User'}</p>
          </motion.div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              Logout
            </Button>
            
            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              
              {notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <AnimatePresence>
                      {notifications?.map((notification) => (
                        <motion.div 
                          key={notification.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-3 border-b border-gray-100 flex justify-between items-start ${notification.type === 'urgent' ? 'bg-red-50' : ''}`}
                        >
                          <div>
                            <p className={`${notification.type === 'urgent' ? 'text-red-600 font-medium' : ''}`}>{notification.message}</p>
                            <p className="text-xs text-gray-500">Just now</p>
                          </div>
                          <button 
                            onClick={() => dismissNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center text-red-600 font-bold border border-gray-200">
              {getBloodType()}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue={userType} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="donor">Donor View</TabsTrigger>
            <TabsTrigger value="hospital">Hospital View</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="donor">
                <DonorDashboard userData={isDonorData(userData) ? userData : undefined} />
              </TabsContent>
              <TabsContent value="hospital">
                <HospitalDashboard userData={isHospitalData(userData) ? userData : undefined} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}