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

    // Get current semester from setup
    const currentSemester = user.attendanceSetups?.[0]?.semester;

    // Process attendance records into stats by course
    const stats = user.attendance.reduce((acc, record) => {
      if (record.semester !== currentSemester) return acc;

      if (!acc[record.courseName]) {
        acc[record.courseName] = {
          totalClasses: record.totalClasses || 0,
          attendedClasses: record.attendedClasses || 0
        };
      }

      return acc;
    }, {});

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}