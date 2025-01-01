import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Setup from '@/models/Setup';
import Attendance from '@/models/Attendance';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { courseName } = await req.json();

    // Remove course from setup
    await Setup.updateOne(
      { userId: session.user.email },
      { $pull: { courses: { name: courseName } } }
    );

    // Remove course attendance records
    await Attendance.deleteMany({
      userId: session.user.email,
      courseName
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing course:', error);
    return NextResponse.json(
      { error: 'Failed to remove course' },
      { status: 500 }
    );
  }
} 