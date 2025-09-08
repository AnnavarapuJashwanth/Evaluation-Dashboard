// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ name: "", email: "", profileImage: "" });
  const [loading, setLoading] = useState(true);

  // Auto-detect API URL (local dev vs production on Render)
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://evaluation-dashboard-9.onrender.com");

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, API_URL]);

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/profile/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card p-4 shadow-lg profile-card">
        <h2 className="text-center mb-4">My Profile</h2>
        <div className="text-center mb-3">
          <img
            src={form.profileImage || "/default-avatar.png"}
            alt="profile"
            className="rounded-circle shadow"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="text"
            value={form.name}
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-control mb-3"
            type="email"
            value={form.email}
            placeholder="Email"
            disabled
          />
          <input
            className="form-control mb-3"
            type="text"
            value={form.profileImage}
            placeholder="Profile Image URL"
            onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
          />
          <button className="btn btn-primary w-100">Update Profile</button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Profile;
