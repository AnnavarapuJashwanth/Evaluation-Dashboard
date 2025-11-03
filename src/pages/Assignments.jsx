import React, { useState } from "react";
import axios from "axios";
import "./Assignments.css";

// ✅ API URL setup
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

function Assignments() {
  const [firstFile, setFirstFile] = useState(null);
  const [secondFile, setSecondFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState({ first: "", second: "" });

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setMessage("❌ Only PDF files are allowed");
      setMessageType("error");
      return;
    }
    fileType === "first"
      ? setFirstFile(file)
      : setSecondFile(file);
    setFileNames((prev) => ({ ...prev, [fileType]: file.name }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!firstFile || !secondFile) {
      setMessage("⚠️ Please select both files first");
      setMessageType("warning");
      return;
    }

    const formData = new FormData();
    formData.append("firstFile", firstFile);
    formData.append("secondFile", secondFile);

    setLoading(true);
    setMessage("Processing files... This may take a minute.");
    setMessageType("info");
    setComparisonResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/assignments/compare`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          timeout: 180000,
        }
      );
      setMessage("✅ Files compared successfully!");
      setMessageType("success");
      setComparisonResult(res.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "An unexpected error occurred.";
      setMessage(`❌ ${errorMsg}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstFile(null);
    setSecondFile(null);
    setFileNames({ first: "", second: "" });
    setMessage("");
    setComparisonResult(null);
    document.getElementById("firstFile").value = null;
    document.getElementById("secondFile").value = null;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h2>Assignment Similarity Checker</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpload}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>File One</label>
                <input
                  id="firstFile"
                  type="file"
                  onChange={(e) => handleFileChange(e, "first")}
                  className="form-control"
                  accept=".pdf"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>File Two</label>
                <input
                  id="secondFile"
                  type="file"
                  onChange={(e) => handleFileChange(e, "second")}
                  className="form-control"
                  accept=".pdf"
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Comparing..." : "Compare Files"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </button>
          </form>
          {message && (
            <div className={`alert mt-3 alert-${messageType}`}>{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
