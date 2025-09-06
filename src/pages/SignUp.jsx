import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css"; // ✅ custom styles

function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      toast.success("Signup Successful 🎉 Redirecting to Sign In...", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/signin"), 2200); // redirect after toast
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed ❌", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100">Sign Up</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
