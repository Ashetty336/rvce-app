import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import StudentCourse from '@/models/StudentCourse';

export async function getCoursesBySemesterAndBranch(semester, branch) {
  await dbConnect();
  return Course.find({
    semester,
    $or: [
      { branch },
      { branch: { $in: ['ALL', null] } } // For common courses
    ]
  });
}

export async function getStudentAttendance(userId) {
  await dbConnect();
  return StudentCourse.findOne({ userId })
    .populate('courses.courseId')
    .lean();
}

export async function updateBulkAttendance(userId, courseId, attendanceRecords) {
  await dbConnect();
  const studentCourse = await StudentCourse.findOne({
    userId,
    'courses.courseId': courseId
  });

  if (!studentCourse) {
    throw new Error('Student course record not found');
  }

  const courseIndex = studentCourse.courses.findIndex(
    c => c.courseId.toString() === courseId.toString()
  );

  // Add bulk attendance records
  studentCourse.courses[courseIndex].attendance.push(...attendanceRecords);

  // Recalculate totals
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  studentCourse.courses[courseIndex].totalClasses += attendanceRecords.length;
  studentCourse.courses[courseIndex].attendedClasses += presentCount;

  await studentCourse.save();
  return studentCourse;
} 