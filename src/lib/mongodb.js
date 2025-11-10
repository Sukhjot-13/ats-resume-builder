
import mongoose from 'mongoose';
import logger from '@/lib/logger';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error({ file: 'src/lib/mongodb.js' }, 'MONGODB_URI is not defined');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  logger.info({ file: 'src/lib/mongodb.js', function: 'dbConnect' }, 'Attempting to connect to MongoDB');
  if (cached.conn) {
    logger.info({ file: 'src/lib/mongodb.js', function: 'dbConnect' }, 'Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info({ file: 'src/lib/mongodb.js', function: 'dbConnect' }, 'New MongoDB connection established');
      return mongoose;
    }).catch((error) => {
      logger.error({ file: 'src/lib/mongodb.js', function: 'dbConnect', error: error.message }, 'Error connecting to MongoDB');
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
