// frontend/src/pages/AboutPlace.js

import React from 'react';

const AboutPlace = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">About This Place Sharing App</h1>
      <p>
        Welcome to our Place Sharing platform. This app is built with the MERN stack
        (MongoDB, Express, React, Node.js) and allows users to:
      </p>
      <ul>
        <li>Sign up and log in</li>
        <li>Create new places with location and description</li>
        <li>Edit or delete your own places</li>
        <li>Browse places shared by other users</li>
      </ul>
      <p>
        Whether you’re a traveler sharing your favorite spots or a local showing off hidden gems,
        this app helps connect people through places.
      </p>
    </div>
  );
};

export default AboutPlace;
