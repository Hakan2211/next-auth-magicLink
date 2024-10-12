import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClientAdmin';
import { setSessionCookie } from '@/components/auth/actions/setCookie';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const type = searchParams.get('type');

  if (!token || !email || type !== 'magiclink') {
    console.log('Invalid parameters:', { token, email, type });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('Error verifying OTP:', error.message);
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', request.url)
      );
    }

    if (data.session) {
      const cookieResult = await setSessionCookie(data.session.access_token);
      console.log('Cookie set result:', cookieResult);

      console.log('User email from session:', email);

      // Updated database query with error handling
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('paymentStatus')
        .eq('email', email)
        .maybeSingle();

      console.log('User data retrieved:', userData);

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return NextResponse.redirect(
          new URL('/login?error=user_fetch_failed', request.url)
        );
      }

      if (!userData) {
        console.log('No user found with email:', email);
        // Redirect to enrollment if no user found
        return NextResponse.redirect(new URL('/enroll', request.url));
      }

      console.log('Payment status:', userData.paymentStatus);

      if (userData.paymentStatus === 'paid') {
        console.log('Redirecting to /course');
        return NextResponse.redirect(new URL('/course', request.url));
      } else {
        console.log('Redirecting to /enroll');
        return NextResponse.redirect(new URL('/enroll', request.url));
      }
    }

    console.log('No session created');
    return NextResponse.redirect(
      new URL('/login?error=session_creation_failed', request.url)
    );
  } catch (err) {
    console.error('Unexpected error during verification:', err);
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', request.url)
    );
  }
}
