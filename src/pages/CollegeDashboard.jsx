import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentProfile from "../components/StudentProfile";
import SearchBar from "../components/SearchBar";

const CollegeDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async (searchParams = "", page = 1) => {
    try {
      const uid = localStorage.getItem("userId");
      setUserId(uid);
      if (!uid) {
        setError("Please login to view colleges.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/colleges/filter/${uid}`;

      if (searchParams) {
        url = `http://localhost:5000/api/colleges/search?${searchParams}&page=${page}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.colleges) {
        setColleges(res.data.colleges);
        setPagination(res.data.pagination);
      } else {
        setColleges(res.data);
        setPagination(null);
      }
    } catch (err) {
      setError("Failed to fetch colleges.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    fetchColleges(); // Refresh colleges after profile update
  };

  if (loading) return <p className="text-center mt-10">Loading colleges...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">College Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => setShowProfile(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Student Profile
          </button>
          <button onClick={() => fetchColleges()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Refresh as per Preferences
          </button>
        </div>
      </div>
      <SearchBar onSearch={(params) => fetchColleges(params, 1)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No matching colleges found.</p>
        ) : (
          colleges.map((college) => (
            <div key={college._id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition duration-300">
              <img src={college.image || "https://via.placeholder.com/300"} alt={college.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{college.name}</h2>
                <p className="text-gray-500">{college.location}</p>
                <p className="mt-2 text-sm">{college.description}</p>
                <p className="mt-2 font-semibold">Courses:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {college.courses?.map((course, i) => <li key={i}>{course}</li>)}
                </ul>
                <div className="mt-4 space-x-2">
                  <button onClick={() => setSelectedCollege(college)} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                    View More
                  </button>
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 inline-block">
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => {
              setCurrentPage(prev => prev - 1);
              fetchColleges("", currentPage - 1);
            }}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalColleges} colleges)
          </span>
          <button
            onClick={() => {
              setCurrentPage(prev => prev + 1);
              fetchColleges("", currentPage + 1);
            }}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {showProfile && <StudentProfile userId={userId} onClose={() => setShowProfile(false)} onUpdate={handleProfileUpdate} />}
      {selectedCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedCollege.name}</h2>
            <img src={selectedCollege.image || "https://via.placeholder.com/600"} alt={selectedCollege.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-gray-600 mb-2"><strong>Location:</strong> {selectedCollege.location}</p>
            <p className="text-gray-600 mb-2"><strong>Fees:</strong> ₹{selectedCollege.fees}</p>
            <p className="mb-4">{selectedCollege.description}</p>
            <p className="font-semibold mb-2">Courses Offered:</p>
            <ul className="list-disc list-inside mb-4">
              {selectedCollege.courses?.map((course, i) => <li key={i}>{course}</li>)}
            </ul>
            <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Visit Website
            </a>
            <button onClick={() => setSelectedCollege(null)} className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;
