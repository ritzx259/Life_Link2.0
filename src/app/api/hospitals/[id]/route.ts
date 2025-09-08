import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await params to fix the warning
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Hospital ID is required' },
        { status: 400 }
      );
    }
    
    // Mock hospital data instead of database query
    const hospital = {
      id: id,
      name: 'Central Hospital',
      email: 'admin@centralhospital.com',
      address: '456 Medical Center Blvd, Anytown, USA',
      phone: '(555) 987-6543',
      website: 'https://centralhospital.com',
      licenseNumber: 'MED-12345-HC',
      createdAt: '2022-03-15'
    };
    
    // Mock blood inventory data
    const bloodInventory: Record<string, any> = {
      'A+': {
        units: 25,
        demand: 'low',
        capacity: 50,
        expiringUnits: 2
      },
      'A-': {
        units: 10,
        demand: 'medium',
        capacity: 30,
        expiringUnits: 0
      },
      'B+': {
        units: 15,
        demand: 'low',
        capacity: 40,
        expiringUnits: 1
      },
      'B-': {
        units: 5,
        demand: 'medium',
        capacity: 20,
        expiringUnits: 0
      },
      'AB+': {
        units: 8,
        demand: 'medium',
        capacity: 15,
        expiringUnits: 0
      },
      'AB-': {
        units: 3,
        demand: 'high',
        capacity: 10,
        expiringUnits: 0
      },
      'O+': {
        units: 4,
        demand: 'high',
        capacity: 60,
        expiringUnits: 0
      },
      'O-': {
        units: 2,
        demand: 'high',
        capacity: 30,
        expiringUnits: 0
      }
    };
    
    // Mock upcoming donations
    const upcomingResults = [
      { id: '101', date: '2024-07-15', time: '09:00:00', donorName: 'Alice Smith', bloodType: 'A+', status: 'scheduled', firstTime: false },
      { id: '102', date: '2024-07-15', time: '10:30:00', donorName: 'Bob Johnson', bloodType: 'O-', status: 'scheduled', firstTime: true },
      { id: '103', date: '2024-07-16', time: '14:00:00', donorName: 'Carol Williams', bloodType: 'B+', status: 'scheduled', firstTime: false },
      { id: '104', date: '2024-07-17', time: '11:15:00', donorName: 'David Brown', bloodType: 'AB+', status: 'scheduled', firstTime: false },
      { id: '105', date: '2024-07-18', time: '16:30:00', donorName: 'Emma Davis', bloodType: 'O+', status: 'scheduled', firstTime: true }
    ];
    
    // Mock recent activity
    const activityResults = [
      { id: '201', action: 'Blood donation received', bloodType: 'A+', quantity: 450, timestamp: '2024-07-10T14:30:00Z' },
      { id: '202', action: 'Appointment scheduled', bloodType: 'O-', quantity: null, timestamp: '2024-07-10T10:15:00Z' },
      { id: '203', action: 'Blood donation received', bloodType: 'B+', quantity: 450, timestamp: '2024-07-09T16:45:00Z' },
      { id: '204', action: 'Status updated', bloodType: 'AB-', quantity: null, timestamp: '2024-07-09T09:20:00Z' },
      { id: '205', action: 'Blood donation received', bloodType: 'O+', quantity: 450, timestamp: '2024-07-08T11:10:00Z' }
    ];
    
    // Mock emergency alerts
     const alertsResults = [
       { type: 'critical', message: 'Urgent need for O- blood type', date: '2024-07-10', createdAt: '2024-07-10T08:30:00Z' },
       { type: 'warning', message: 'Low inventory for AB- blood type', date: '2024-07-09', createdAt: '2024-07-09T14:15:00Z' },
       { type: 'info', message: 'Blood drive scheduled for next week', date: '2024-07-08', createdAt: '2024-07-08T10:45:00Z' }
     ];
    
    // Mock monthly stats
    const monthlyStatsResults = [
      { month: 'Jul', donations: 45, usage: 20250 },
      { month: 'Jun', donations: 42, usage: 18900 },
      { month: 'May', donations: 38, usage: 17100 },
      { month: 'Apr', donations: 40, usage: 18000 },
      { month: 'Mar', donations: 35, usage: 15750 },
      { month: 'Feb', donations: 30, usage: 13500 }
    ];
    
    // Mock hospital stats
     const stats = {
      donorsThisMonth: 45,
      bloodCollectedL: 20.25, // 20,250 ml
      donationsCount: 45
     };
     
    // Prepare hospital dashboard data
    const hospitalData = {
      ...hospital,
      contactInfo: {
        phone: hospital.phone || '555-123-4567',
        email: hospital.email,
        website: hospital.website || 'www.hospital.org'
      },
      stats: {
        donorsThisMonth: stats.donorsThisMonth || 0,
        bloodCollectedL: (stats.bloodCollectedL || 0) / 1000, // Convert ml to L
        patientsHelped: Math.floor((stats.bloodCollectedL || 0) / 450) * 3, // Assuming 1 donation can help 3 patients
        donationGrowth: 12 // Mock data for now
      },
      bloodInventory,
      upcomingDonations: upcomingResults,
      emergencyAlerts: alertsResults,
      recentActivity: activityResults,
      monthlyStats: monthlyStatsResults.map((stat: any) => ({
        month: stat.month,
        donations: stat.donations,
        usage: Math.round(stat.usage / 1000) // Convert ml to L and round
      }))
    };
    
    return NextResponse.json(hospitalData);
  } catch (error) {
    console.error('Error fetching hospital data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital data' },
      { status: 500 }
    );
  }
}