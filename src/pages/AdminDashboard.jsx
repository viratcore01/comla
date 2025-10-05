import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (activeTab === 'users') {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data);
      } else if (activeTab === 'colleges') {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } });
        setColleges(res.data);
      } else if (activeTab === 'applications') {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/applications`, { headers: { Authorization: `Bearer ${token}` } });
        setApplications(res.data);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) {
      setError("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (!window.confirm("Delete college?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/colleges/${collegeId}`, { headers: { Authorization: `Bearer ${token}` } });
      setColleges(colleges.filter(c => c._id !== collegeId));
    } catch (err) {
      setError("Failed to delete college");
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/applications/${appId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (user?.role !== 'admin') return <div className="p-6">Unauthorized</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4">
        <button onClick={() => setActiveTab('users')} className={`mr-4 px-4 py-2 ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Users</button>
        <button onClick={() => setActiveTab('colleges')} className={`mr-4 px-4 py-2 ${activeTab === 'colleges' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Colleges</button>
        <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 ${activeTab === 'applications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Applications</button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                      <option value="student">Student</option>
                      <option value="college">College</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'colleges' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Colleges</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Location</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map(c => (
                <tr key={c._id} className="border">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.location}</td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteCollege(c._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'applications' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Applications</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Student</th>
                <th className="p-2">College</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a._id} className="border">
                  <td className="p-2">{a.student.name}</td>
                  <td className="p-2">{a.college.name}</td>
                  <td className="p-2">
                    <select value={a.status} onChange={(e) => handleStatusChange(a._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-2">N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;