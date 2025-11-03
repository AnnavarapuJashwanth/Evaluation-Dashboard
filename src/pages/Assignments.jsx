// src/components/Assignments.jsx

import React, { useState } from "react";
import axios from "axios";
import "./Assignments.css"; // We'll add some CSS for better readability

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
    if (fileType === "first") {
      setFirstFile(file);
      setFileNames((prev) => ({ ...prev, first: file.name }));
    } else {
      setSecondFile(file);
      setFileNames((prev) => ({ ...prev, second: file.name }));
    }
    setMessage("");
    setMessageType("");
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
    setMessage("Processing files... This may take a minute for scanned documents.");
    setMessageType("info");
    setComparisonResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/assignments/compare",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          timeout: 180000, // 3-minute timeout for heavy OCR tasks
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
      setComparisonResult(null);
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
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h2 className="mb-0">Assignment Similarity Checker</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpload}>
                {/* File input fields (your existing code is fine here) */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstFile" className="form-label fw-bold">File One</label>
                    <input id="firstFile" type="file" onChange={(e) => handleFileChange(e, "first")} required className="form-control" accept=".pdf"/>
                    {fileNames.first && (<small className="text-muted d-block mt-1">Selected: {fileNames.first}</small>)}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="secondFile" className="form-label fw-bold">File Two</label>
                    <input id="secondFile" type="file" onChange={(e) => handleFileChange(e, "second")} required className="form-control" accept=".pdf"/>
                    {fileNames.second && (<small className="text-muted d-block mt-1">Selected: {fileNames.second}</small>)}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? (<><span className="spinner-border spinner-border-sm me-2" />Comparing...</>) : "Compare Files"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={loading}>Reset</button>
                </div>
              </form>

              {message && (
                <div className={`alert mt-3 alert-${messageType === "info" ? "primary" : messageType === "success" ? "success" : "danger"}`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {comparisonResult && (
            <div className="card shadow-sm mt-4">
              <div className="card-header">
                <h3>Comparison Results</h3>
              </div>
              <div className="card-body">
                <div className="row text-center mb-3">
                  <div className="col-md-4">
                    <h4>Similarity</h4>
                    <p className="fs-3 fw-bold">{(comparisonResult.similarity * 100).toFixed(1)}%</p>
                  </div>
                  <div className="col-md-4">
                    <h4>Matching Lines</h4>
                    <p className="fs-3">{comparisonResult.matchingLines}</p>
                  </div>
                  <div className="col-md-4">
                    <h4>Total Lines</h4>
                    <p className="fs-3">{comparisonResult.totalLinesCompared}</p>
                  </div>
                </div>

                {/* NEW: DETAILED LINE-BY-LINE VIEW */}
                <div className="mt-3">
                  <h4 className="mb-3">Detailed Line Comparison</h4>
                  <div className="table-responsive comparison-table-container">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>#</th>
                          <th>{fileNames.first || "File 1"}</th>
                          <th>{fileNames.second || "File 2"}</th>
                          <th>Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonResult.lineComparisons?.map((line, index) => (
                          <tr key={index} className={line.matched ? "table-success" : ""}>
                            <td>{line.lineNumber}</td>
                            <td><pre className="line-content">{line.firstFileLine}</pre></td>
                            <td><pre className="line-content">{line.secondFileLine}</pre></td>
                            <td className="text-center">
                              <span className={`badge ${line.matched ? "bg-success" : "bg-secondary"}`}>
                                {(line.similarity * 100).toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;