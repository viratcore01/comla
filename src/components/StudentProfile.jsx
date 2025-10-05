import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentProfile = ({ userId, onClose, onUpdate }) => {
  const [profile, setProfile] = useState({
    subjects: [],
    competitiveExams: [],
    ranks: [{ exam: "", rank: "" }],
    preferredCourses: [],
    location: "",
    minBudget: "",
    maxBudget: ""
  });

  useEffect(() => {
    // Fetch current user profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

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
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Failed to update profile";
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Student Profile</h2>
        <div className="space-y-4">
          <input
            name="subjects"
            placeholder="Subjects (comma separated)"
            value={profile.subjects.join(", ")}
            onChange={(e) => handleArrayChange("subjects", e.target.value)}
            className="border p-2 w-full"
          />
          <input
            name="competitiveExams"
            placeholder="Competitive Exams (comma separated)"
            value={profile.competitiveExams.join(", ")}
            onChange={(e) => handleArrayChange("competitiveExams", e.target.value)}
            className="border p-2 w-full"
          />
          <div>
            <label>Ranks:</label>
            {profile.ranks.map((rank, index) => (
              <div key={index} className="flex space-x-2 mt-1">
                <input
                  placeholder="Exam"
                  value={rank.exam}
                  onChange={(e) => handleRankChange(index, "exam", e.target.value)}
                  className="border p-2 flex-1"
                />
                <input
                  type="number"
                  placeholder="Rank"
                  value={rank.rank}
                  onChange={(e) => handleRankChange(index, "rank", e.target.value)}
                  className="border p-2 flex-1"
                />
              </div>
            ))}
            <button onClick={addRank} className="text-blue-500 mt-1">Add Rank</button>
          </div>
          <input
            name="preferredCourses"
            placeholder="Preferred Courses (comma separated)"
            value={profile.preferredCourses.join(", ")}
            onChange={(e) => handleArrayChange("preferredCourses", e.target.value)}
            className="border p-2 w-full"
          />
          <input
            name="location"
            placeholder="Preferred Location"
            value={profile.location}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="minBudget"
            type="number"
            placeholder="Min Budget"
            value={profile.minBudget}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="maxBudget"
            type="number"
            placeholder="Max Budget"
            value={profile.maxBudget}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;