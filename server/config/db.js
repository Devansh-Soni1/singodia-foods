import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/singodhia_foods';
    console.log(`Connecting to MongoDB at: ${connUri.includes('@') ? connUri.split('@')[1] : connUri}...`);
    
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 15000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('Backend will continue operating with in-memory / fallback seed support if Atlas is not yet reachable.');
    return false;
  }
};

