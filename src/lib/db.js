import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE/MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: 'mydb', // Explicitly specify your database name
      bufferCommands: false, // Disable mongoose buffering
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log("MongoDB Connected to:", mongoose.connection.db.databaseName);
        return mongoose;
      })
      .catch(err => {
        console.error("MongoDB Connection Error:", err);
        cached.promise = null; // Clear promise to allow retry
        throw new Error(`Database connection failed: ${err.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;