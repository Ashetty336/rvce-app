import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/database';
import StudentCourse from '@/models/StudentCourse';
import ArchivedSemester from '@/models/ArchivedSemester';

export async function POST(request) {
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
      return NextResponse.json(
        { error: 'No active semester found' },
        { status: 404 }
      );
    }

    // Archive current semester data
    await ArchivedSemester.create({
      userId: session.user.id,
      semester: studentCourse.semester,
      branch: studentCourse.branch,
      courses: studentCourse.courses,
      schedule: studentCourse.schedule,
      archivedAt: new Date()
    });

    // Delete current semester data
    await StudentCourse.deleteOne({ userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Archive semester error:', error);
    return NextResponse.json(
      { error: 'Failed to archive semester' },
      { status: 500 }
    );
  }
} 