import mongoose, { Mongoose } from 'mongoose';

// Async provider that establishes a MongoDB connection using MONGODB_URI from .env
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<Mongoose> => {
      const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/heyama';
      // Connect with recommended options for modern drivers
      return mongoose.connect(uri, {
        // You can tweak options here if needed (pool size, timeouts, etc.)
      });
    },
  },
];
