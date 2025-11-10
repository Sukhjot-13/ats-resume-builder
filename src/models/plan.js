
import mongoose from 'mongoose';
import logger from '@/lib/logger';

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Other plan-specific fields (e.g., price, features) go here
});

const Plan = (mongoose.models && mongoose.models.Plan) || mongoose.model('Plan', PlanSchema);

if (!mongoose.models || !mongoose.models.Plan) {
  logger.info({ file: 'src/models/plan.js' }, 'Plan model compiled');
} else {
  logger.info({ file: 'src/models/plan.js' }, 'Plan model retrieved from cache');
}

export default Plan;
