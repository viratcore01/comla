import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../components/AuthContext";

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [smartFilterEnabled, setSmartFilterEnabled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (smartFilterEnabled) {
      handleSmartFilter();
    } else {
      fetchColleges();
    }
  }, [smartFilterEnabled]);

  const fetchColleges = async (searchParams = "") => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/colleges`;
      if (searchParams) {
        url = `${process.env.REACT_APP_API_BASE_URL}/colleges/search?${searchParams}`;
      }
      const res = await axios.get(url);
      setColleges(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load colleges. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSmartFilter = async () => {
    if (!user) {
      alert("Please login to use smart filtering.");
      return;
    }

    try {
      const profileData = {
        subjects: user.subjects || [],
        competitiveExams: user.competitiveExams || [],
        preferredCourses: user.preferredCourses || [],
        location: user.location,
        minBudget: user.minBudget,
        maxBudget: user.maxBudget
      };

      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/colleges/filter`, profileData);
      setColleges(res.data.colleges);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to get personalized recommendations.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Colleges</h1>
      {console.log("Rendering CollegeList with smartFilterEnabled:", smartFilterEnabled)}

      {/* Smart Filter Toggle */}
      <div className="mb-6 flex items-center justify-between bg-red-100 p-6 rounded-lg border-4 border-red-300 shadow-lg">
        <div>
          <span className="text-lg font-bold text-blue-800">🎯 Smart Filter</span>
          <p className="text-sm text-blue-600">Apply your profile preferences to see personalized college recommendations</p>
        </div>
        <button
          onClick={() => setSmartFilterEnabled(!smartFilterEnabled)}
          className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
            smartFilterEnabled
              ? 'bg-green-500 text-white shadow-lg transform scale-105'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {smartFilterEnabled ? 'ON ✅' : 'OFF'}
        </button>
      </div>

      <SearchBar onSearch={fetchColleges} onSmartFilter={handleSmartFilter} />
      {loading && <p className="text-blue-500 mb-4">Loading colleges...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && !error && colleges.length === 0 && <p className="text-gray-500 mb-4">No colleges found.</p>}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {colleges.map(college => (
          <div key={college._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/colleges/${college._id}`)}>
            <div className="relative h-40 w-full mb-2">
              <img
                src={college.image || "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/default-college-campus.jpg"}
                alt={college.name}
                className="h-full w-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/default-college-campus.jpg";
                }}
              />
            </div>
            <h2 className="text-xl font-bold">{college.name}</h2>
            <p className="text-sm text-gray-600">📍 {college.location} | 🏆 #{college.ranking}</p>
            <p className="mt-2 text-sm">{college.description.substring(0, 100)}...</p>
            <div className="mt-2">
              <p className="text-sm font-medium">Courses: {college.courses?.slice(0, 2).join(', ')}{college.courses?.length > 2 ? '...' : ''}</p>
              <p className="text-sm font-medium">Fees: ₹{college.fees?.toLocaleString()}</p>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm ml-1">
                {college.reviews?.length > 0 ? (college.reviews.reduce((sum, r) => sum + r.rating, 0) / college.reviews.length).toFixed(1) : 'N/A'}
              </span>
              <span className="text-sm text-gray-500 ml-1">({college.reviews?.length || 0} reviews)</span>
            </div>
            <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block text-sm hover:underline">Visit Website</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
