import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    subjects: [],
    competitiveExams: [],
    ranks: [{ exam: "", rank: "" }],
    preferredCourses: [],
    location: "",
    minBudget: "",
    maxBudget: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleArrayChange = (field, value) => {
    setProfile({ ...profile, [field]: value.split(",").map(item => item.trim()).filter(item => item) });
  };

  const handleRankChange = (index, key, value) => {
    const newRanks = [...profile.ranks];
    newRanks[index][key] = value;
    setProfile({ ...profile, ranks: newRanks });
  };

  const addRank = () => {
    setProfile({ ...profile, ranks: [...profile.ranks, { exam: "", rank: "" }] });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/auth/profile/${user._id}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Failed to update profile";
      alert(errorMessage);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subjects</label>
          <input
            name="subjects"
            placeholder="Subjects (comma separated)"
            value={profile.subjects.join(", ")}
            onChange={(e) => handleArrayChange("subjects", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Competitive Exams</label>
          <input
            name="competitiveExams"
            placeholder="Competitive Exams (comma separated)"
            value={profile.competitiveExams.join(", ")}
            onChange={(e) => handleArrayChange("competitiveExams", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ranks</label>
          {profile.ranks.map((rank, index) => (
            <div key={index} className="flex space-x-2 mt-1">
              <input
                placeholder="Exam"
                value={rank.exam}
                onChange={(e) => handleRankChange(index, "exam", e.target.value)}
                className="border p-2 flex-1 rounded"
              />
              <input
                type="number"
                placeholder="Rank"
                value={rank.rank}
                onChange={(e) => handleRankChange(index, "rank", e.target.value)}
                className="border p-2 flex-1 rounded"
              />
            </div>
          ))}
          <button onClick={addRank} className="text-blue-500 mt-1 text-sm">+ Add Rank</button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Courses</label>
          <input
            name="preferredCourses"
            placeholder="Preferred Courses (comma separated)"
            value={profile.preferredCourses.join(", ")}
            onChange={(e) => handleArrayChange("preferredCourses", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Location</label>
          <input
            name="location"
            placeholder="Preferred Location"
            value={profile.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Budget</label>
            <input
              name="minBudget"
              type="number"
              placeholder="Min Budget"
              value={profile.minBudget}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Budget</label>
            <input
              name="maxBudget"
              type="number"
              placeholder="Max Budget"
              value={profile.maxBudget}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;