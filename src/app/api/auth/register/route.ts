import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, type, bloodType, location } = await request.json();
    
    // Validate required fields
    if (!email || !password || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if type is valid
    if (type !== 'donor' && type !== 'hospital') {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }
    
    // Determine which table to use based on user type
    const table = type === 'hospital' ? 'hospitals' : 'donors';
    
    // Check if email is already in use
    const checkEmailQuery = `SELECT * FROM ${table} WHERE email = ?`;
    const existingUsers = await executeQuery(checkEmailQuery, [email]) as any[];
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }
    
    // Insert the new user into the database
    let insertQuery;
    let queryParams;
    
    if (type === 'donor') {
      insertQuery = `INSERT INTO donors (name, email, password, blood_type) VALUES (?, ?, ?, ?)`;
      queryParams = [name, email, password, bloodType];
    } else {
      insertQuery = `INSERT INTO hospitals (name, email, password, location) VALUES (?, ?, ?, ?)`;
      queryParams = [name, email, password, location];
    }
    
    const result = await executeQuery(insertQuery, queryParams);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        user: {
          name,
          email,
          type,
          ...(type === 'donor' ? { bloodType } : { location })
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration request' },
      { status: 500 }
    );
  }
}