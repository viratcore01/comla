import React, { useState } from "react";

const FilterPanel = ({ onFilter }) => {
  const [location, setLocation] = useState("");
  const [branch, setBranch] = useState("");

  const applyFilters = () => {
    onFilter({ location, branch });
  };

  return (
    <div className="flex flex-wrap gap-4 my-4">
      <select
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 rounded text-black"
      >
        <option value="">All Locations</option>
        <option value="Ghaziabad">Ghaziabad</option>
        <option value="Noida">Noida</option>
      </select>
      <select
        onChange={(e) => setBranch(e.target.value)}
        className="p-2 rounded text-black"
      >
        <option value="">All Branches</option>
        <option value="CSE (AI/ML)">CSE (AI/ML)</option>
        <option value="ECE">ECE</option>
        <option value="IT">IT</option>
      </select>
      <button
        onClick={applyFilters}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;
