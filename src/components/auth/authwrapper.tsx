'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm } from 'react-hook-form';
import { sendMagicLink } from './actions/sendMagicLink';
import { useRouter } from 'next/navigation';
import { checkUserAndInsert } from './actions/useDatabaseActions';

// import { supabasePublic } from '@/lib/supabaseClient';
// import { setSessionCookie } from './actions/setCookie';

interface MagicLinkFormProps {
  mode: 'login' | 'enroll';
  onClose: () => void;
}

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function Authwrapper({ mode, onClose }: MagicLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const handleFormSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        // Check if the user is already in the database or insert if not
        const userResponse = await checkUserAndInsert({
          email: data.email,
          mode,
        });

        if (userResponse.error) {
          console.error('Database Error:', userResponse.error);
          setError(
            'An error occurred while processing your information. Please try again.'
          );
          setIsLoading(false);
          return;
        }

        if (userResponse.status === 'existsPaid') {
          if (mode === 'enroll') {
            // User already enrolled and paid, redirect to login
            router.push('/login'); // Redirect to login page
            setIsLoading(false);
            return;
          } else if (mode === 'login') {
            // User exists and paid, send magic link for login
            try {
              await sendMagicLink({ email: data.email, mode });
              setSuccess(true);
              // const {
              //   data: { session },
              //   error: sessionError,
              // } = await supabasePublic.auth.getSession();
              // if (sessionError || !session) {
              //   console.error('Error fetching session:', sessionError?.message);
              //   setError(
              //     'An error occurred while fetching session. Please try again.'
              //   );
              //   setIsLoading(false);
              //   return;
              // }
              // const cookieResult = await setSessionCookie(session.access_token);
              // if (cookieResult.success) {

              //   router.push('/course');
              // } else {
              //   console.error('Failed to set session cookie');
              //   setError(
              //     'An error occurred while setting up your session. Please try again.'
              //   );
              // }
            } catch (err) {
              console.error('Error sending magic link:', err);
              setError(
                'An error occurred while sending the magic link. Please try again.'
              );
            }
            setIsLoading(false);
            return;
          }
        } else if (userResponse.status === 'existsUnpaid') {
          // User exists but not paid
          setError(
            'You need to enroll and complete payment before logging in.'
          );
          router.push('/enroll'); // Redirect to enroll page to complete enrollment
          setIsLoading(false);
          return;
        } else if (userResponse.status === 'newUser') {
          if (mode === 'enroll') {
            // Redirect to payment (commented out for now)----------------------------PAYMENT---------------------------------------------------payment--------------------
            // router.push('/payment');

            // Redirect user after successful enrollment
            try {
              await sendMagicLink({ email: data.email, mode });
              setSuccess(true);
              setError(null);
              // Redirect user after successful enrollment
              onClose();
              router.push('/welcome');
            } catch (err) {
              console.error('Error sending magic link:', err);
              setError(
                'An error occurred while sending the enrollment confirmation. Please try again.'
              );
            }
          } else {
            // No user found and trying to log in
            setError('No account found. Please enroll first.');
            onClose(); // Close the dialog before redirecting
            router.push('/enroll'); // Redirect to enroll page
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(
          'An error occurred while processing your request. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    });
  };

  const buttonText =
    mode === 'login' ? 'Send Magic Link' : 'Proceed to Payment';
  const titleText =
    mode === 'login' ? 'Log in to your account' : 'Enroll to the course';
  const descriptionText =
    mode === 'login'
      ? 'Enter your email to receive a magic link for logging in.'
      : 'Enter your email to get access to the course.';

  return (
    <div className="h-1/2 p-2 flex items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{descriptionText}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          required
                        />
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert variant="success">
                    <AlertDescription>
                      {mode === 'login'
                        ? 'Magic link sent! Check your email.'
                        : 'Enrollment successful! Check your email for further instructions.'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : buttonText}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
