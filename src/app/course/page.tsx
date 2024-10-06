'use client';

import useAuthorization from '@/components/auth/hooks/useAuthorization';
import React from 'react';

function Course() {
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
    <div className="flex items-center justify-center text-3xl">
      Here is the course curriculum
    </div>
  );
}

export default Course;
