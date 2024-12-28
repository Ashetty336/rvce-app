import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseCode, date, status } = await req.json();
    
    const attendance = await Attendance.create({
      userId: session.user.email,
      courseCode,
      date: new Date(date),
      status
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Attendance update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 