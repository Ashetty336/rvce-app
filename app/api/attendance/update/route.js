import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { updateAttendance } from '@/lib/db-operations';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseCode, date, status } = await req.json();
    const attendance = await updateAttendance(
      session.user.email,
      courseCode,
      date,
      status
    );

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Attendance update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 