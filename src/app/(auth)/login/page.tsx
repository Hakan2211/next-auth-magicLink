'use client';
import Authwrapper from '@/components/auth/authwrapper';
import React from 'react';

function Login() {
  return <Authwrapper mode="login" onSubmit={async (email) => {}} />;
}

export default Login;
