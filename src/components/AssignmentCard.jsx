import React from "react";

function AssignmentCard({ assignment }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{assignment.filename}</h5>
        <p className="card-text">
          <strong>Uploaded:</strong> {new Date(assignment.createdAt).toLocaleString()}
        </p>
        <p className="card-text">
          <strong>Similarity:</strong> {(assignment.similarityScore * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default AssignmentCard;