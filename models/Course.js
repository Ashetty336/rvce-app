import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  credits: {
    L: Number,  // Lecture
    T: Number,  // Tutorial
    P: Number,  // Practical
    total: Number
  },
  branch: String,
  semester: Number,
  category: String,
  marks: {
    cie: {
      theory: Number,
      lab: Number
    },
    see: {
      theory: Number,
      lab: Number
    }
  },
  duration: Number
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course; 