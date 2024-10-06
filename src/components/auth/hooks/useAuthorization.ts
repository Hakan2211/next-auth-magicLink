'use client';

// app/hooks/useAuthorization.ts
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabasePublic } from '@/lib/supabaseClient';

// Custom hook to check if the user is authorized to access the course
export default function useAuthorization() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        setLoading(true);

        // Get the logged-in user's session from Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabasePublic.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError?.message);
          router.push('/login');
          return;
        }

        if (!session) {
          router.push('/login');
          return;
        }

        const userEmail = session.user.email;

        // Check if the user has paid in the database
        const { data: user, error: userError } = await supabasePublic
          .from('users')
          .select('paymentStatus')
          .eq('email', userEmail)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError.message);
          router.push('/login'); // Redirect to login if user data cannot be fetched
          return;
        }

        if (user?.paymentStatus === 'paid') {
          setIsAuthorized(true); // Allow access if user has paid
        } else {
          router.push('/enroll'); // Redirect to enroll if user has not paid
        }
      } catch (err) {
        console.error('Unexpected error during authorization:', err);
        router.push('/login'); // Redirect to login if an error occurs
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  return { isAuthorized, loading };
}
