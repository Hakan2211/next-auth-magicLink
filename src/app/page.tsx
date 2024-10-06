import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Site</h1>
      <p className="mb-4">
        This is the main content area. It will expand to fill available space.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <Link href={'/course'}>
        <Button>Course</Button>
      </Link>
    </main>
  );
}
