// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import React from 'react';
import CollegeList from './pages/CollegeList';
import CollegeDashboard from "./pages/CollegeDashboard";
import CollegeDetail from "./pages/CollegeDetail";
import StudentDetails from "./pages/StudentDetails";
import StudentApplications from "./pages/StudentApplications";
import CollegeApplications from "./pages/CollegeApplications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
  path="/colleges/:id"
  element={
    <MainLayout>
      <CollegeDetail />
    </MainLayout>
  }
/>
        <Route
          path="/about-us"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />
        <Route
  path="/colleges"
  element={
    <MainLayout>
      <CollegeList />
    </MainLayout>
  }
/>
 <Route
   path="/college-dashboard"
   element={
     <MainLayout>
       <CollegeDashboard />
     </MainLayout>
   }
 />
        <Route
          path="/student-details"
          element={
            <MainLayout>
              <StudentDetails />
            </MainLayout>
          }
        />
        <Route
          path="/student-applications"
          element={
            <MainLayout>
              <StudentApplications />
            </MainLayout>
          }
        />
        <Route
          path="/college-applications"
          element={
            <MainLayout>
              <CollegeApplications />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
