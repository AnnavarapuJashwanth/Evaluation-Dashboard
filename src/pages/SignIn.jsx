import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignIn.css";

// ✅ API URL setup (dev vs production)
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/signin`, form);
      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful 🎉", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/"), 2200);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container">
      <div className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn btn-primary w-100">Sign In</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignIn;
