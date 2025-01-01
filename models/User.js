import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['theory', 'lab'],
    default: 'theory',
    required: true
  }
}, { 
  _id: false, 
  strict: true,
  minimize: false 
});

const attendanceSetupSchema = new mongoose.Schema({
  branch: String,
  semester: String,
  courses: {
    type: [courseSchema],
    default: [],
    required: true
  },
  schedule: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { 
  _id: false, 
  strict: true,
  minimize: false 
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  image: String,
  attendanceSetups: [attendanceSetupSchema],
  attendance: [{
    semester: String,
    courseName: String,
    totalClasses: Number,
    attendedClasses: Number,
    date: Date
  }]
}, { 
  strict: true,
  timestamps: true 
});

// Add password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 