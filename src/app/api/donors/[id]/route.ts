import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await params to fix the warning
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Donor ID is required' },
        { status: 400 }
      );
    }
    
    // Mock donor data instead of database query
    const donor = {
      id: id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      bloodType: 'O+',
      address: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      createdAt: '2023-05-10'
    };
    
    // Mock donation history
    const donationHistory = [
      { date: '2024-05-15', location: 'Central Hospital', bloodVolume: 450, status: 'completed' },
      { date: '2024-01-20', location: 'Community Blood Center', bloodVolume: 450, status: 'completed' },
      { date: '2023-09-05', location: 'University Medical Center', bloodVolume: 450, status: 'completed' },
      { date: '2023-05-12', location: 'Central Hospital', bloodVolume: 450, status: 'completed' }
    ];
    
    // Calculate eligibility (assuming 56 days between donations)
    const lastDonation = donationHistory[0]?.date || null;
    let eligibleToDonateDays = 0;
    let nextEligibleDate = new Date().toISOString().split('T')[0];
    
    if (lastDonation) {
      const lastDonationDate = new Date(lastDonation);
      const today = new Date();
      const daysSinceLastDonation = Math.floor((today.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
      eligibleToDonateDays = Math.max(0, 56 - daysSinceLastDonation);
      
      if (eligibleToDonateDays > 0) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + eligibleToDonateDays);
        nextEligibleDate = nextDate.toISOString().split('T')[0];
      }
    }
    
    // Get nearby blood drives (mock data)
    const nearbyDrives = [
      { id: 1, name: 'Community Blood Drive', date: '2024-07-20', distance: '0.8 miles' },
      { id: 2, name: 'University Hospital Drive', date: '2024-07-25', distance: '1.2 miles' },
      { id: 3, name: 'Corporate Blood Drive', date: '2024-08-01', distance: '2.5 miles' }
    ];
    
    // Prepare donor dashboard data with mock impact stats
    const donorData = {
      ...donor,
      lastDonation,
      eligibleToDonateDays,
      nextEligibleDate,
      donationStreak: 3,
      badges: ['First Time Donor', 'Regular Donor', 'Life Saver'],
      donationHistory: donationHistory,
      impactStats: {
        livesSaved: 12,
        hospitalsHelped: 3,
        totalBloodVolume: '1800 ml',
        donorRank: 'Gold',
        percentile: 85
      },
      nearbyDrives
    };
    
    return NextResponse.json(donorData);
  } catch (error) {
    console.error('Error fetching donor data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donor data' },
      { status: 500 }
    );
  }
}