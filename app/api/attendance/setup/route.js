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
    const { semester, branch, courses, schedule } = await request.json();

    // Update or create student course setup with all fields
    const studentCourse = await StudentCourse.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        semester,
        branch,
        courses: courses.map(course => ({
          ...course,
          totalClasses: course.totalClasses || 0,
          attendedClasses: course.attendedClasses || 0
        })),
        schedule,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, setup: studentCourse });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to save setup' },
      { status: 500 }
    );
  }
}

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

    return NextResponse.json({ setup: studentCourse || null });
  } catch (error) {
    console.error('Fetch setup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch setup' },
      { status: 500 }
    );
  }
} 