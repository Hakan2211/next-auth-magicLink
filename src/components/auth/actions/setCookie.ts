'use server';

import { cookies } from 'next/headers';

export async function setSessionCookie(token: string) {
  try {
    cookies().set('HakanCourse', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    console.log('Session cookie set successfully');

    return { success: true };
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return { success: false, error: 'Failed to set session cookie' };
  }
}
