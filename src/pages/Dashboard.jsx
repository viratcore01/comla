import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../components/AuthContext";

// College Image Component with Unsplash auto-fetch
const CollegeImage = ({ collegeName, fallback }) => {
  const [imageSrc, setImageSrc] = useState(fallback);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(collegeName + ' college building')}&per_page=1&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
        if (response.data.results && response.data.results.length > 0) {
          setImageSrc(response.data.results[0].urls.regular);
        }
      } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
        setImageSrc("https://via.placeholder.com/300x300?text=College+Image");
      }
    };

    if (!fallback) {
      fetchImage();
    }
  }, [collegeName, fallback]);

  return <img src={imageSrc} alt={collegeName} className="h-40 w-full object-cover rounded mb-2" loading="lazy" />;
};

const Dashboard = () => {
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
      // Mock data for demonstration with client-side filtering
      const allColleges = [
        {
          _id: "1",
          name: "Delhi University",
          image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=center",
          description: "Top university in Delhi with excellent placement records.",
          location: "Delhi",
          courses: ["CSE", "BBA", "Engineering"],
          fees: 50000,
          ranking: 1
        },
        {
          _id: "2",
          name: "IIT Delhi",
          image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center",
          description: "Premier engineering institute in India.",
          location: "Delhi",
          courses: ["Computer Science", "Mechanical Engineering"],
          fees: 200000,
          ranking: 2
        },
        {
          _id: "3",
          name: "IIT Bombay",
          image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=center",
          description: "Leading technical institute in Mumbai.",
          location: "Mumbai",
          courses: ["Civil Engineering", "Chemical Engineering"],
          fees: 250000,
          ranking: 3
        },
        {
          _id: "4",
          name: "IIT Madras",
          image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center",
          description: "Top engineering institute in Chennai.",
          location: "Chennai",
          courses: ["Computer Science", "Biotechnology"],
          fees: 220000,
          ranking: 4
        }
      ];

      let filteredColleges = allColleges;

      // Apply client-side filtering if search params provided
      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        const q = params.get('q');
        const location = params.get('location');
        const courses = params.get('courses');
        const minFees = params.get('minFees');
        const maxFees = params.get('maxFees');

        if (q) {
          filteredColleges = filteredColleges.filter(college =>
            college.name.toLowerCase().includes(q.toLowerCase()) ||
            college.location.toLowerCase().includes(q.toLowerCase()) ||
            college.description.toLowerCase().includes(q.toLowerCase()) ||
            college.courses.some(course => course.toLowerCase().includes(q.toLowerCase()))
          );
        }

        if (location) {
          filteredColleges = filteredColleges.filter(college =>
            college.location.toLowerCase().includes(location.toLowerCase())
          );
        }

        if (courses) {
          const courseArray = courses.split(',').map(c => c.trim().toLowerCase());
          filteredColleges = filteredColleges.filter(college =>
            courseArray.some(course => college.courses.some(c => c.toLowerCase().includes(course)))
          );
        }

        if (minFees) {
          filteredColleges = filteredColleges.filter(college => college.fees >= parseInt(minFees));
        }

        if (maxFees) {
          filteredColleges = filteredColleges.filter(college => college.fees <= parseInt(maxFees));
        }
      }

      setColleges(filteredColleges);
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
      const collegesData = res.data.colleges || res.data;
      setColleges(Array.isArray(collegesData) ? collegesData : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to get personalized recommendations.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Colleges</h1>
      {console.log("Rendering Dashboard with smartFilterEnabled:", smartFilterEnabled)}

      {/* Smart Filter Toggle */}
      <div className="mb-6 flex items-center justify-between bg-red-100 p-6 rounded-lg border-4 border-red-300 shadow-lg">
        <div>
          <span className="text-lg font-bold text-red-800">🎯 Smart Filter</span>
          <p className="text-sm text-red-600">Apply your profile preferences to see personalized college recommendations</p>
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
      {!loading && !error && colleges.length === 0 && (
        <p className="text-center text-gray-500 py-8">⚠️ No colleges found. Try adjusting your search or filters.</p>
      )}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(colleges) && colleges.map(college => (
          <div key={college._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/colleges/${college._id}`)}>
            <CollegeImage collegeName={college.name} fallback={college.image} />
            <h2 className="text-xl font-bold">{college.name}</h2>
            <p className="text-sm text-gray-700">📍 {college.location} | 🏆 #{college.ranking}</p>
            <p className="mt-2 text-sm text-gray-800">{college.description.substring(0, 100)}...</p>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-800">Courses: {college.courses?.slice(0, 2).join(', ')}{college.courses?.length > 2 ? '...' : ''}</p>
              <p className="text-sm font-medium text-gray-800">Fees: ₹{college.fees?.toLocaleString()}</p>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm ml-1 text-gray-800">
                {college.reviews?.length > 0 ? (college.reviews.reduce((sum, r) => sum + r.rating, 0) / college.reviews.length).toFixed(1) : 'N/A'}
              </span>
              <span className="text-sm text-gray-600 ml-1">({college.reviews?.length || 0} reviews)</span>
            </div>
            <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block text-sm hover:underline">Visit Website</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
