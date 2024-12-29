import mongoose from 'mongoose';

const archivedSemesterSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  courses: [{
    code: String,
    name: String,
    type: String,
    totalClasses: Number,
    attendedClasses: Number,
    attendance: [{
      date: Date,
      status: {
        type: String,
        enum: ['present', 'absent', 'cancelled']
      }
    }]
  }],
  schedule: {
    type: Map,
    of: [String]
  },
  archivedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.ArchivedSemester || 
  mongoose.model('ArchivedSemester', archivedSemesterSchema); 