import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'cancelled'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ userId: 1, courseName: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema); 