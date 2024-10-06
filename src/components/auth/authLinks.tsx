'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Authwrapper from '@/components/auth/authwrapper';

export default function Authlinks() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <div className="">
      <Button onClick={() => setLoginOpen(true)} variant="outline">
        {/* <Link href="/login">Login</Link> */}
        Login
      </Button>
      <Button onClick={() => setEnrollOpen(true)}>
        {/* <Link href="/enroll">Enroll</Link> */}
        Enroll
      </Button>

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-slate-400">
          <DialogHeader className="pb-20">
            <DialogTitle>Log in to your account</DialogTitle>
            <DialogDescription>
              You will get a link to your email for loggin in.
            </DialogDescription>
          </DialogHeader>
          <Authwrapper mode="login" onClose={() => setLoginOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Enroll Modal */}
      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent className="bg-slate-400">
          <DialogHeader className="pb-20">
            <DialogTitle>Enroll to the course</DialogTitle>
            <DialogDescription>
              Enroll and buy and get access to the course.
            </DialogDescription>
          </DialogHeader>
          <Authwrapper mode="enroll" onClose={() => setEnrollOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
