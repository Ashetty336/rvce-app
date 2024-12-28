import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setup from '@/models/Setup';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setup = await Setup.findOne({ userId: session.user.email });
    return NextResponse.json({ setup });
  } catch (error) {
    console.error('Setup fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const setup = await Setup.findOneAndUpdate(
      { userId: session.user.email },
      { ...data, userId: session.user.email },
      { upsert: true, new: true }
    );

    return NextResponse.json({ setup });
  } catch (error) {
    console.error('Setup save error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 