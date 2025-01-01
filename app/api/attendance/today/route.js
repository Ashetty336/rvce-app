import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ attendance: {} }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const date = dateStr ? new Date(dateStr) : new Date();
    
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ attendance: {} }, { status: 404 });
    }

    const currentSemester = user.attendanceSetups?.[0]?.semester;
    const todayAttendance = (user.attendance || []).reduce((acc, record) => {
      if (record?.semester === currentSemester && 
          record?.date && 
          new Date(record.date).toDateString() === date.toDateString()) {
        acc[record.courseName] = record.status;
      }
      return acc;
    }, {});

    return NextResponse.json({ attendance: todayAttendance });
  } catch (error) {
    console.error('Today attendance fetch error:', error);
    return NextResponse.json({ attendance: {} }, { status: 500 });
  }
}