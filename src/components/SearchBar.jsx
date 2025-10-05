import React, { useState } from "react";

const SearchBar = ({ onSearch, onSmartFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    location: "",
    courses: "",
    minFees: "",
    maxFees: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    onSearch(queryParams.toString());
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      location: "",
      courses: "",
      minFees: "",
      maxFees: "",
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  return (
    <div className="w-full mb-6">
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          name="q"
          placeholder="Search colleges, courses, locations..."
          value={filters.q}
          onChange={handleFilterChange}
          className="flex-1 p-2 rounded border text-black"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Filters {showFilters ? '▲' : '▼'}
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        {onSmartFilter && (
          <button
            onClick={onSmartFilter}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            🎯 Smart Filter
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-100 p-4 rounded border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-2 rounded border text-black"
            />
            <input
              type="text"
              name="courses"
              placeholder="Courses (comma separated)"
              value={filters.courses}
              onChange={handleFilterChange}
              className="p-2 rounded border text-black"
            />
            <input
              type="number"
              name="minFees"
              placeholder="Min Fees"
              value={filters.minFees}
              onChange={handleFilterChange}
              className="p-2 rounded border text-black"
            />
            <input
              type="number"
              name="maxFees"
              placeholder="Max Fees"
              value={filters.maxFees}
              onChange={handleFilterChange}
              className="p-2 rounded border text-black"
            />
          </div>
          <div className="flex space-x-4 items-center">
            <div>
              <label className="mr-2">Sort by:</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="p-1 rounded border text-black"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="fees">Fees</option>
              </select>
            </div>
            <div>
              <label className="mr-2">Order:</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="p-1 rounded border text-black"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <button
              onClick={clearFilters}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
