import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  console.log('Starting registration process...');

  try {
    // Connect to database first
    try {
      await dbConnect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Detailed database connection error:', {
        name: dbError.name,
        message: dbError.message,
        code: dbError.code
      });
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError.message 
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('Received registration data:', {
      username: body.username,
      email: body.email,
      hasPassword: !!body.password
    });

    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({
      username,
      email,
      password
    });

    console.log('User created successfully:', user.username);

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
    console.error('Registration error:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 