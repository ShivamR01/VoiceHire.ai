// File: app/actions/auth.ts
'use server';
// This is a Server Action. It only runs on the server.
import dbConnect from '@/lib/dbConnect';
import User from '@/models/UserModel';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod schema for validation
const signupSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  // FIX: Added 'as const' to the array to strictly define it as a tuple for Zod
  role: z.enum(['CANDIDATE', 'RECRUITER'] as const).refine(value => {
    if (value !== 'CANDIDATE' && value !== 'RECRUITER') {
      throw new Error('Please select a valid role (Candidate or Recruiter).');
    }
    return true;
  }),
});

interface SignupState {
  success: boolean;
  message: string;
}

export async function signupUser(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  // 1. Validate data
  const result = signupSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { email, password, role, name } = result.data;

  try {
    await dbConnect();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user with the selected role and name
    await User.create({
      email,
      password: hashedPassword,
      role: role,
      name: name, 
    });

    return { success: true, message: 'Account created successfully! Please log in.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}