// app/actions/sendMagicLink.ts
'use server';

import { supabaseAdmin } from '@/lib/supabaseClientAdmin';
import resend from '@lib/resendClient';

interface MagicLinkParams {
  email: string;
  mode: 'login' | 'enroll';
}

export async function sendMagicLink({ email, mode }: MagicLinkParams) {
  try {
    // Generate the magic link with Supabase Admin API
    const { data: magicLinkData, error: generateLinkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}`,
        },
      });

    if (generateLinkError) {
      console.error('Error generating magic link:', generateLinkError.message);
      throw new Error('Failed to generate magic link');
    }

    // Use Resend to send the email with the custom link
    const actionLink = magicLinkData?.properties?.action_link;

    if (actionLink) {
      const subject =
        mode === 'login'
          ? 'Your Login Magic Link'
          : 'Enroll Confirmation Magic Link';
      const htmlMessage =
        mode === 'login'
          ? `<p>Click the link below to log in to your account:</p><a href="${actionLink}">Login with this magic link</a>`
          : `<p>Thank you for enrolling! Click the link below to confirm your enrollment:</p><a href="${actionLink}/course">Confirm Enrollment with this magic link</a>`;

      if (resend) {
        await resend.emails.send({
          from: 'Hakan@hakanda.com',
          to: email,
          subject: subject,
          html: htmlMessage,
        });
        return { success: true };
      } else {
        throw new Error('Resend client is not initialized');
      }
    } else {
      throw new Error('Magic link could not be generated');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw new Error('An error occurred while processing your request');
  }
}
