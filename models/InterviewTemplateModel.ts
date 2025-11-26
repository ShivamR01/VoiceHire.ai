// File: models/InterviewTemplateModel.ts
// This is the Mongoose schema for an interview template.
// It has been updated to correctly store an array of strings
// and to support AI-generated templates.

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for a single question
export interface IQuestion {
  text: string;
  type: 'BEHAVIORAL' | 'TECHNICAL' | 'SITUATIONAL';
}

// Interface for the InterviewTemplate document
export interface IInterviewTemplate extends Document {
  title: string;
  description: string;
  createdBy?: mongoose.Schema.Types.ObjectId;
  isPublic: boolean;
  isAIGenerated: boolean;
  questions: string[]; // <-- This is the corrected type
}

// The Mongoose Schema
const InterviewTemplateSchema: Schema<IInterviewTemplate> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Make sure AI-generated templates have a description
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null, // AI templates might not have a user
  },
  isPublic: {
    type: Boolean,
    default: false, // Default to private for recruiter-generated templates
  },
  isAIGenerated: {
    type: Boolean,
    default: false, // Flag to show it was made by AI
  },
  // --- THIS IS THE FIX ---
  // This schema now correctly defines an array of simple strings.
  questions: {
    type: [String], // An array of strings
    required: true,
    validate: [
      (val: string[]) => val.length > 0,
      'Questions array cannot be empty',
    ],
  },
});

// Create the model, reusing it if it already exists
const InterviewTemplate: Model<IInterviewTemplate> =
  mongoose.models.InterviewTemplate ||
  mongoose.model<IInterviewTemplate>(
    'InterviewTemplate',
    InterviewTemplateSchema
  );

export default InterviewTemplate;