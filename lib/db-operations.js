import dbConnect from './dbConnect';
import Course from '@/models/Course';
import StudentCourse from '@/models/StudentCourse';
import Setup from '@/models/Setup';
import Attendance from '@/models/Attendance';
import ArchivedSemester from '@/models/ArchivedSemester';

export async function getStudentAttendance(userId) {
  await dbConnect();
  return StudentCourse.findOne({ userId })
    .populate('courses.courseId')
    .lean();
}

export async function updateAttendance(userId, courseCode, date, status) {
  await dbConnect();
  return Attendance.create({
    userId,
    courseCode,
    date: new Date(date),
    status
  });
}

export async function getAttendanceStats(userId) {
  await dbConnect();
  return Attendance.aggregate([
    { $match: { userId } },
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
}

export async function archiveSemester(userId) {
  await dbConnect();
  const studentCourse = await StudentCourse.findOne({ userId });
  if (!studentCourse) return null;

  const archived = await ArchivedSemester.create({
    userId,
    semester: studentCourse.semester,
    branch: studentCourse.branch,
    courses: studentCourse.courses,
    schedule: studentCourse.schedule,
    archivedAt: new Date()
  });

  await StudentCourse.deleteOne({ userId });
  return archived;
} 