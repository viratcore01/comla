import React from 'react';

const AboutUs = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">About Comla</h1>
      <p>
        Welcome to Comla, your comprehensive college application platform designed to streamline the process of applying to colleges and universities. Comla is built with the MERN stack (MongoDB, Express, React, Node.js) and empowers students, colleges, and administrators with powerful tools to manage the entire application lifecycle.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">What We Offer:</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>For Students:</strong> Create profiles, browse colleges, submit applications with document uploads, and track application status.</li>
        <li><strong>For Colleges:</strong> Manage your institution's profile, review student applications, and communicate with applicants.</li>
        <li><strong>For Administrators:</strong> Oversee the entire platform, manage users, and ensure smooth operations.</li>
      </ul>
      <p>
        Comla bridges the gap between aspiring students and their dream colleges, making the application process transparent, efficient, and user-friendly. Whether you're a high school student exploring higher education options or a college representative seeking top talent, Comla is here to simplify and enhance your experience.
      </p>
      <p className="mt-4">
        Join thousands of students and colleges already using Comla to shape the future of education.
      </p>
    </div>
  );
};

export default AboutUs;
