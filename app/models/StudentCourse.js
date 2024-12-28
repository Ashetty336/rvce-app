import mongoose from 'mongoose';

const studentCourseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  semester: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  courses: [{
    code: String,
    name: String,
    type: String,
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    }
  }],
  schedule: {
    type: Map,
    of: [String],
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.StudentCourse || 
  mongoose.model('StudentCourse', studentCourseSchema); 