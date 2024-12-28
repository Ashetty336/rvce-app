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
    const { courseCode, date, status } = await request.json();

    const studentCourse = await StudentCourse.findOne({
      userId: session.user.id
    });

    if (!studentCourse) {
      return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
    }

    // Update course attendance
    const courseIndex = studentCourse.courses.findIndex(c => c.code === courseCode);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    studentCourse.courses[courseIndex].totalClasses += 1;
    if (status === 'present') {
      studentCourse.courses[courseIndex].attendedClasses += 1;
    }

    await studentCourse.save();

    return NextResponse.json({ 
      success: true,
      attendance: {
        totalClasses: studentCourse.courses[courseIndex].totalClasses,
        attendedClasses: studentCourse.courses[courseIndex].attendedClasses
      }
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
} 