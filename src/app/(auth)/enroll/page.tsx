'use client';

import Authwrapper from '@/components/auth/authwrapper';
import React from 'react';

function Enroll() {
  return (
    <div>
      <Authwrapper mode="enroll" onClose={() => {}} />
    </div>
  );
}

export default Enroll;
