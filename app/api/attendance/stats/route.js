import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/database';
import StudentCourse from '@/models/StudentCourse';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const studentCourse = await StudentCourse.findOne({
      userId: session.user.id
    });

    if (!studentCourse) {
      return NextResponse.json({ attendance: {} });
    }

    // Calculate attendance for each course
    const attendance = {};
    studentCourse.courses.forEach(course => {
      attendance[course.code] = {
        totalClasses: course.totalClasses || 0,
        attendedClasses: course.attendedClasses || 0
      };
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance stats' },
      { status: 500 }
    );
  }
} 