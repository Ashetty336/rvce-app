import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/database';
import StudentCourse from '@/models/StudentCourse';

export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courses } = await request.json();

    const studentCourse = await StudentCourse.findOne({
      userId: session.user.id
    });

    if (!studentCourse) {
      return NextResponse.json(
        { error: 'No course setup found' },
        { status: 404 }
      );
    }

    // Update courses while preserving attendance data
    studentCourse.courses = courses.map(newCourse => {
      const existingCourse = studentCourse.courses.find(c => c.code === newCourse.code);
      return {
        ...newCourse,
        totalClasses: existingCourse?.totalClasses || 0,
        attendedClasses: existingCourse?.attendedClasses || 0,
        attendance: existingCourse?.attendance || []
      };
    });

    await studentCourse.save();

    return NextResponse.json({ success: true, courses: studentCourse.courses });
  } catch (error) {
    console.error('Update courses error:', error);
    return NextResponse.json(
      { error: 'Failed to update courses' },
      { status: 500 }
    );
  }
} 