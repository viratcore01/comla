import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

// Add axios interceptor for automatic token refresh
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const StudentApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/applications/${user._id}`);
      setApplications(res.data);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/applications/${applicationId}`);
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      setError("Failed to withdraw application");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{app.college.name}</h2>
              <p>Location: {app.college.location}</p>
              <p>Status: <span className={`font-bold ${app.status === 'accepted' ? 'text-green-500' : app.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{app.status}</span></p>
              <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              {app.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(app._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;