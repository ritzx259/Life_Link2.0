import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Determine which table to query based on user type
    const table = userType === 'hospital' ? 'hospitals' : 'donors';
    
    // Query the database for the user
    const query = `SELECT * FROM ${table} WHERE email = ?`;
    const results = await executeQuery(query, [email]) as any[];
    
    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const user = results[0];
    
    // In a real app, you would hash the password and compare hashes
    // For now, we're comparing plain text passwords
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Set a cookie for authentication
    cookies().set('user_session', JSON.stringify({
      id: user.id,
      email: user.email,
      type: userType
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    
    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    );
  }
}