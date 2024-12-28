import mongoose from 'mongoose';

const setupSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  courses: [{
    name: {
      type: String,
      required: true
    }
  }],
  schedule: {
    type: Map,
    of: [String],
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.models.Setup || mongoose.model('Setup', setupSchema); 