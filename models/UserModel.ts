// File: models/UserModel.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string; // Password is required on creation, but optional to return
  name?: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  subscriptionTier: 'FREE' | 'PREMIUM';
  stripeCustomerId?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hashed, `select: false` stops it from being returned by default
  name: { type: String },
  role: {
    type: String,
    enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'],
    default: 'CANDIDATE',
  },
  subscriptionTier: {
    type: String,
    enum: ['FREE', 'PREMIUM'],
    default: 'FREE',
  },
  stripeCustomerId: { type: String, unique: true, sparse: true }, // sparse:true allows multiple nulls
  createdAt: { type: Date, default: Date.now },
});

// Ensure the model is not re-compiled if it already exists
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);