const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB: Using existing connection');
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB: MONGODB_URI is not set.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = !!conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    isConnected = false;
  }
};

module.exports = connectDB;
