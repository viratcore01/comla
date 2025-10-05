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

const CollegeApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.role === 'college') {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/applications/college/${user.collegeId}`);
      setApplications(res.data);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/applications/${applicationId}/status`, { status });
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (user?.role !== 'college') return <div className="p-6">Unauthorized</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">College Applications</h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{app.student.name}</h2>
              <p>Email: {app.student.email}</p>
              <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              <p>Status: <span className={`font-bold ${app.status === 'accepted' ? 'text-green-500' : app.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{app.status}</span></p>
              {app.documents && app.documents.length > 0 && (
                <div>
                  <p>Documents:</p>
                  <ul>
                    {app.documents.map((doc, idx) => (
                      <li key={idx}><a href={`http://localhost:5000/${doc}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">Document {idx + 1}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <button
                  onClick={() => handleStatusUpdate(app._id, 'accepted')}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                  disabled={app.status === 'accepted'}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(app._id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={app.status === 'rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollegeApplications;