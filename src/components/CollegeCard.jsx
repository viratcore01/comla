import React from "react";

const CollegeCard = ({ college }) => {
  const handleApply = () => {
    alert(`Applied to ${college.name}`);
  };

  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <h2 className="text-xl font-bold">{college.name}</h2>
      <p>Location: {college.location}</p>
      <p>Branch: {college.branch}</p>
      <button
        onClick={handleApply}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default CollegeCard;
