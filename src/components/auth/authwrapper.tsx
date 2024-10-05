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
import { useForm } from 'react-hook-form';
import { sendMagicLink } from './actions/sendMagicLink';

interface MagicLinkFormProps {
  mode: 'login' | 'enroll';
}

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function Authwrapper({ mode }: MagicLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        const result = await sendMagicLink({ email: data.email, mode });

        if (result.success) {
          setSuccess(true);
        } else {
          setError(
            'An error occurred while sending the magic link. Please try again.'
          );
        }
      } catch (err) {
        console.error('Error:', err);
        setError(
          'An error occurred while sending the magic link. Please try again.'
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
