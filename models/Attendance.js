import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  }
}, {
  timestamps: true
});

// Create compound index for unique attendance records per user per course per day
AttendanceSchema.index({ userId: 1, courseName: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);