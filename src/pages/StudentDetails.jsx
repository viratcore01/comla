import React, { useState } from "react";

const StudentDetails = () => {
  const [form, setForm] = useState({
    name: "",
    class12: "",
    class10: "",
    aadhaar: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here (e.g., send to backend)
    alert("Details submitted!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Student Details</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Full Name"
          required
        />
        <input
          name="class12"
          value={form.class12}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Class 12 Marks (%)"
          type="number"
          min="0"
          max="100"
          required
        />
        <input
          name="class10"
          value={form.class10}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Class 10 Marks (%)"
          type="number"
          min="0"
          max="100"
          required
        />
        <input
          name="aadhaar"
          value={form.aadhaar}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Aadhaar Card Number"
          maxLength="12"
          required
        />
        <label className="block mb-2 text-gray-700">Upload Documents (PDF/JPG/PNG):</label>
        <input
          name="file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentDetails;