'use client';
import Authwrapper from '@/components/auth/authwrapper';
import React from 'react';

function Enroll() {
  return <Authwrapper mode="enroll" onSubmit={async (email) => {}} />;
}

export default Enroll;
