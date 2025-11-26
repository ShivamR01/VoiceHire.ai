// File: models/InterviewSessionModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInterviewSession extends Document {
  user?: Types.ObjectId; // Changed to optional
  template: Types.ObjectId; 
  status: 'IN_PROGRESS' | 'COMPLETED';
  conductedBy?: Types.ObjectId; 
  candidateEmail?: string; 
  transcript: {
    speaker: 'AI' | 'USER';
    text: string;
    timestamp: Date;
  }[];
  feedback?: {
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    detailedAnalysis: string;
  };
  createdAt: Date;
}

const InterviewSessionSchema: Schema = new Schema({
  // FIX: 'user' is now optional. Recruiter creates session with just email first.
  // When candidate joins, we poplate this.
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  
  template: {
    type: Schema.Types.ObjectId,
    ref: 'InterviewTemplate',
    required: true,
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS',
  },
  conductedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null, 
  },
  candidateEmail: {
    type: String,
    default: null, 
  },
  transcript: [
    {
      speaker: { type: String, enum: ['AI', 'USER'] },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  feedback: {
    overallScore: Number,
    strengths: [String],
    areasForImprovement: [String],
    detailedAnalysis: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession>(
    'InterviewSession',
    InterviewSessionSchema
  );