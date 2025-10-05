import { useState } from "react";
import axios from "axios";

const AddCollege = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    website: "",
    courses: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/colleges`, {
        ...form,
        courses: form.courses.split(",")
      });
      alert("College added!");
    } catch (err) {
      console.error(err);
      alert("Failed to add college");
    }
  };

  return (
    <div>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="image" onChange={handleChange} placeholder="Image URL" />
      <textarea name="description" onChange={handleChange} placeholder="Description" />
      <input name="location" onChange={handleChange} placeholder="Location" />
      <input name="website" onChange={handleChange} placeholder="Website" />
      <input name="courses" onChange={handleChange} placeholder="Courses (comma separated)" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
