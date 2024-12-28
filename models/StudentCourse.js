import mongoose from 'mongoose';

const studentCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    schedule: [{
      day: String,  // Monday, Tuesday, etc.
      time: String, // "9:00 AM"
      duration: Number // in minutes
    }],
    attendance: [{
      date: Date,
      status: {
        type: String,
        enum: ['present', 'absent', 'cancelled'],
        default: 'present'
      }
    }],
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    }
  }]
}, { timestamps: true });

const StudentCourse = mongoose.models.StudentCourse || mongoose.model('StudentCourse', studentCourseSchema);
export default StudentCourse; 