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

    const { courseData, branch, semester } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update attendance records for each course
    for (const [courseName, data] of Object.entries(courseData)) {
      const totalClasses = parseInt(data.totalClasses) || 0;
      const attendedClasses = parseInt(data.attendedClasses) || 0;

      // Create or update attendance record
      const existingRecord = user.attendance.find(
        record => record.courseName === courseName && record.semester === semester
      );

      if (existingRecord) {
        existingRecord.totalClasses = totalClasses;
        existingRecord.attendedClasses = attendedClasses;
      } else {
        user.attendance.push({
          courseName,
          semester,
          totalClasses,
          attendedClasses,
          date: new Date()
        });
      }
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}