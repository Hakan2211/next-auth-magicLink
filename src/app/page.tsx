import { Button } from '@/components/ui/button';
import { getSupabaseServerSession } from '@/lib/getSupabaseServerSession';
import Link from 'next/link';

export default async function Home() {
  const { supabase, session } = await getSupabaseServerSession();

  let userData = null;
  if (session?.user) {
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', session?.user?.email?.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error.message);
    } else {
      userData = userProfile;
    }
  }
  return (
    <main className="p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Site</h1>

      {session?.user ? (
        <>
          <p className="mb-4">Hello, {userData?.name || session.user.email}!</p>
          {userData && (
            <p className="mb-4">Payment Status: {userData.paymentStatus}</p>
          )}
          <Link href="/course">
            <Button>Go to Course</Button>
          </Link>
          <form action="/auth/actions/logout" method="post">
            <Button type="submit" variant="destructive" className="mt-4">
              Logout
            </Button>
          </form>
        </>
      ) : (
        <>
          <p className="mb-4">
            You are not logged in. Please log in to access your courses.
          </p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/enroll">
            <Button className="ml-2">Enroll</Button>
          </Link>
        </>
      )}
    </main>
  );
}
