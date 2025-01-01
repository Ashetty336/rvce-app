import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    if (!username?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already registered' : 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password, // No manual hashing here
      attendanceSetups: [{
        branch: '',
        semester: '',
        courses: [],
        schedule: {}
      }],
      attendance: []
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          username: user.username,
          email: user.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 