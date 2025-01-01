import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseName, date, status, branch, semester } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find existing record for this course and semester
    const existingRecord = user.attendance.find(
      record => 
        record.courseName === courseName && 
        record.semester === semester
    );

    if (existingRecord) {
      // Only update counts if not cancelled
      if (status !== 'cancelled') {
        existingRecord.totalClasses += 1;
        if (status === 'present') {
          existingRecord.attendedClasses += 1;
        }
      }
      existingRecord.date = new Date(date);
    } else {
      // Only create new record with counts if not cancelled
      user.attendance.push({
        courseName,
        semester,
        totalClasses: status !== 'cancelled' ? 1 : 0,
        attendedClasses: status === 'present' ? 1 : 0,
        date: new Date(date)
      });
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Attendance update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 