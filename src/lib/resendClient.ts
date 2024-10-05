import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    'RESEND_API_KEY is missing. Please set it in your environment variables.'
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export default resend;
