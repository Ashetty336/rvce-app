import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/database';
import StudentCourse from '@/models/StudentCourse';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { updates } = await request.json();

    const studentCourse = await StudentCourse.findOne({
      userId: session.user.id
    });

    if (!studentCourse) {
      return NextResponse.json(
        { error: 'No course setup found' },
        { status: 404 }
      );
    }

    // Update each course's attendance
    Object.entries(updates).forEach(([courseCode, data]) => {
      const course = studentCourse.courses.find(c => c.code === courseCode);
      if (course) {
        course.totalClasses = data.totalClasses;
        course.attendedClasses = data.attendedClasses;
      }
    });

    await studentCourse.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
} 