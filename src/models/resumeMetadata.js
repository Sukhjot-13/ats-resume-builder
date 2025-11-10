
import mongoose from 'mongoose';
import logger from '@/lib/logger';

const ResumeMetadataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeMetadata = (mongoose.models && mongoose.models.ResumeMetadata) || mongoose.model('ResumeMetadata', ResumeMetadataSchema);

if (!mongoose.models || !mongoose.models.ResumeMetadata) {
  logger.info({ file: 'src/models/resumeMetadata.js' }, 'ResumeMetadata model compiled');
} else {
  logger.info({ file: 'src/models/resumeMetadata.js' }, 'ResumeMetadata model retrieved from cache');
}

export default ResumeMetadata;
