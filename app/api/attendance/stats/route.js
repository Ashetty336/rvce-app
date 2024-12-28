import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await Attendance.aggregate([
      { $match: { userId: session.user.email } },
      {
        $group: {
          _id: '$courseCode',
          totalClasses: { $sum: 1 },
          attendedClasses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const formattedStats = stats.reduce((acc, stat) => ({
      ...acc,
      [stat._id]: {
        totalClasses: stat.totalClasses,
        attendedClasses: stat.attendedClasses
      }
    }), {});

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 