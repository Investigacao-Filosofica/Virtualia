import mongoose from 'mongoose';

const DEFAULT_OPTIONS = {
  autoIndex: true,
  maxPoolSize: 10,
};

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('MongoDB connection string is not defined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.connection.on('connected', () => {
    console.log('[database] Connected to MongoDB cluster');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[database] MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[database] MongoDB connection lost');
  });

  await mongoose.connect(uri, DEFAULT_OPTIONS);

  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
