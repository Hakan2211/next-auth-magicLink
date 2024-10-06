import React from 'react';

function Welcome() {
  return (
    <div className="flex items-center justify-center text-2xl p-4">
      <div className="w-1/2 bg-red-400 p-4 text-slate-50 rounded-xl">
        <h1>Welcome to the course</h1>
        <p>Thank you for purchasing this course</p>
        We sent you an email with the link to login to the course. Please go to
        your email and click the button login in the email to start the course.
      </div>
    </div>
  );
}

export default Welcome;
