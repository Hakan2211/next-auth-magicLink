'use server';

import { supabaseAdmin } from '@/lib/supabaseClientAdmin';
import { v4 as uuidv4 } from 'uuid';

interface CheckUserAndInsertParams {
  email: string;
  mode: 'login' | 'enroll';
}

interface UserResponse {
  status: 'existsPaid' | 'existsUnpaid' | 'newUser';
  error?: string;
}

export async function checkUserAndInsert({
  email,
  mode,
}: CheckUserAndInsertParams): Promise<UserResponse> {
  try {
    // Check if the user is already in the database
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Database Fetch Error:', fetchError.message);
      return {
        status: 'newUser',
        error: 'An error occurred while checking user information.',
      };
    }

    if (existingUser) {
      if (existingUser.paymentStatus === 'paid') {
        return { status: 'existsPaid' };
      } else {
        return { status: 'existsUnpaid' };
      }
    }

    // User not found, insert a new record for enrollment
    if (mode === 'enroll') {
      const { error: dbError } = await supabaseAdmin.from('users').insert([
        {
          id: uuidv4(), // Generate a new UUID for the user
          email: email,
          paymentStatus: 'unpaid', // Set initial payment status to 'unpaid'
          created_at: new Date(), // Store the timestamp of creation
        },
      ]);

      if (dbError) {
        console.error('Database Insert Error:', dbError.message);
        return {
          status: 'newUser',
          error: 'An error occurred while saving user information.',
        };
      }
    }

    return { status: 'newUser' };
  } catch (err) {
    console.error('Unexpected Error:', err);
    return {
      status: 'newUser',
      error: 'An unexpected error occurred while processing user information.',
    };
  }
}
