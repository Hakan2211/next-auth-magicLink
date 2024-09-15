import Link from 'next/link';
import { Button } from '../ui/button';

function Header() {
  return (
    <header className="bg-primary text-primary-foreground h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          Logo
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        <Button>
          <Link href="/enroll">Enroll</Link>
        </Button>
      </div>
    </header>
  );
}

export default Header;
