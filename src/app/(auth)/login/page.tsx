'use client';

import Authwrapper from '@/components/auth/authwrapper';
import React from 'react';

function Login() {
  return (
    <div>
      <Authwrapper mode="login" onClose={() => {}} />
    </div>
  );
}

export default Login;
