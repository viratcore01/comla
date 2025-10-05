import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

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

// College Image Component with Cloudinary fallback
const CollegeImage = ({ collegeName, fallback }) => {
  const [imageSrc, setImageSrc] = useState(fallback || "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/default-college-campus.jpg");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (fallback && !imageError) {
      setImageSrc(fallback);
    }
  }, [fallback, imageError]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc("https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/default-college-campus.jpg");
    }
  };

  return (
    <img
      src={imageSrc}
      alt={collegeName}
      className="w-full h-64 object-cover rounded"
      onError={handleImageError}
    />
  );
};

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [college, setCollege] = useState(null);
  const [applying, setApplying] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/colleges/${id}`)
      .then(res => setCollege(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('collegeId', id);
      documents.forEach(doc => formData.append('documents', doc));

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/applications/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Application submitted successfully!');
      navigate('/student-applications');
    } catch (err) {
      console.error(err);
      alert('Failed to apply: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (e) => {
    setDocuments([...e.target.files]);
  };

  if (!college) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Image Carousel */}
      <div className="mb-6">
        <CollegeImage collegeName={college.name} fallback={college.images?.[0] || college.image} />
      </div>

      <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
      <p className="text-gray-600 mb-4">📍 {college.location} | 🏆 Ranking: #{college.ranking}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{college.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {college.courses?.map(course => (
              <span key={course} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Placement Stats */}
      {college.placementStats && (
        <div className="bg-green-50 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Placement Statistics</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">₹{college.placementStats.averageSalary?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Average Salary</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">₹{college.placementStats.highestSalary?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Highest Salary</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{college.placementStats.placementRate}%</p>
              <p className="text-sm text-gray-600">Placement Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {college.reviews?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <div className="space-y-3">
            {college.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Fees: ₹{college.fees?.toLocaleString()}</p>
          <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Visit Website</a>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Documents (optional, max 5 files, 5MB each)</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mb-2"
            />
          </div>
          <button
            onClick={handleApply}
            disabled={applying}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
