
import mongoose from 'mongoose';
import logger from '@/lib/logger';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  role: {
    type: Number,
    default: 100, // 0: owner, 100: user
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mainResume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  generatedResumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  }],
});

const User = (mongoose.models && mongoose.models.User) || mongoose.model('User', UserSchema);

if (!mongoose.models || !mongoose.models.User) {
  logger.info({ file: 'src/models/user.js' }, 'User model compiled');
} else {
  logger.info({ file: 'src/models/user.js' }, 'User model retrieved from cache');
}

export default User;
