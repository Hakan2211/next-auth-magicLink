'use client';

import React, { use } from 'react';
import useAuthorization from '@/components/auth/hooks/useAuthorization';

function Lesson() {
  const { isAuthorized, loading } = useAuthorization();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center text-3xl">
        You are not authorized to view this page. Enroll to have acces to the
        course.
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center text-2xl">
      Here is detail page to lesson 1 or 2 or 3 etc
    </div>
  );
}

export default Lesson;
