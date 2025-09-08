import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll return a mock user
    // In a real app, you would verify the session token
    
    // Mock user data for demonstration
    const mockUser = {
      id: '1',
      name: 'John Donor',
      email: 'donor@example.com',
      type: 'donor',
      bloodType: 'O+',
      lastDonation: '2023-10-15',
      donationCount: 5,
      eligibleToDonateDays: 0
    };
    
    // Return the mock user data
    return NextResponse.json({
      user: mockUser
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}