import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the current semester's setup
    const currentSetup = user.attendanceSetups?.[0] || {
      branch: '',
      semester: '',
      courses: [],
      schedule: {}
    };

    return NextResponse.json({ setup: currentSetup });
  } catch (error) {
    console.error('Setup fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received setup data:', JSON.stringify(body, null, 2));

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new setup object
    const currentSetup = {
      branch: body.branch || '',
      semester: body.semester || '',
      courses: [],
      schedule: {}
    };

    // Handle courses array
    if (Array.isArray(body.courses)) {
      currentSetup.courses = body.courses.map(course => ({
        name: String(course.name || '').trim(),
        type: String(course.type || 'theory').trim()
      }));
    }

    // Handle schedule object
    if (body.schedule && typeof body.schedule === 'object') {
      currentSetup.schedule = Object.fromEntries(
        Object.entries(body.schedule).map(([day, courses]) => [
          day,
          Array.isArray(courses) ? courses.map(String) : []
        ])
      );
    }

    // Update user document directly using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { attendanceSetups: [currentSetup] } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return NextResponse.json({ 
      success: true,
      setup: updatedUser.attendanceSetups[0].toObject()
    });

  } catch (error) {
    console.error('Setup update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update setup',
      message: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 