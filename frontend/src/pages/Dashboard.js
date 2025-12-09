import React, { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/tokenUtils";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const fetchFiles = async () => {
    const email = localStorage.getItem("loggedInUser");
    if (!email) return;

    const res = await fetch(
      `https://warranty-reminder-app.onrender.com/dashboard/myfiles?email=${email}`
    );
    const data = await res.json();

    setFiles(
      data.map((file) => ({
        _id: file._id,
        name: file.originalName,
        url: `/uploads/${file.fileName}`,
        type: "pdf",
        productName: file.productName?.fullLine,
        productCategory: file.productName?.productCategory,
        purchaseDate: file.purchaseDate,
        warrantyEndDate: file.warrantyEndDate,
      }))
    );
  };

  useEffect(() => {
    //  token expiry check
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      logout();
      return;
    }

    // Check if user is logged in
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      navigate("/login");
      return;
    }

    fetchFiles();
  }, [navigate]);

  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || '{"name":"user"}'
  );
  const username = user.name;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage(selectedFile ? `Selected: ${selectedFile.name}` : "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", localStorage.getItem("loggedInUser"));

    try {
      const res = await fetch("https://warranty-reminder-app.onrender.com/dashboard/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (res.ok) {
        setMessage(data.message || "Upload successful");
        setFile(null);
        await fetchFiles();
      } else {
        setMessage(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setMessage("Upload failed (network/server error)");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(`Selected: ${e.dataTransfer.files[0].name}`);
    }
  };

  const onButtonClick = () => inputRef.current.click();

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://warranty-reminder-app.onrender.com/dashboard/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Delete Successfully");
        fetchFiles();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      // console.error("DELETE ERROR:", err);
      toast.error("Error deleting file");
    }
  };

  return (
    <div className="dashboard-modern-container">
      <h1 className="dashboard-header">Hello, {username}!</h1>

      <main className="dashboard-modern-main">
        <form
          className={`dashboard-upload-area${dragActive ? " drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onSubmit={handleUpload}
        >
          <input
            ref={inputRef}
            type="file"
            className="dashboard-upload-input"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="dashboard-upload-cloud">
            <p>Drag and drop to upload</p>
            <button
              type="button"
              className="dashboard-upload-btn"
              onClick={onButtonClick}
            >
              Upload
            </button>
            <div className="dashboard-upload-hint">(up to 10MB)</div>
            <div className="dashboard-upload-types">PDF ONLY</div>

            {file && (
              <div className="dashboard-upload-selected">
                Selected: {file.name}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="dashboard-upload-btn upload-submit-btn"
          >
            Submit
          </button>
        </form>

        {message && <div className="dashboard-message">{message}</div>}

        <div className="dashboard-files">
          {files.map((file, idx) => (
            <div className="dashboard-file-card" key={idx}>
              <div className="pdf-icon">📄</div>

              <div className="dashboard-file-info">
                <div className="info-row">
                  <span className="label">Product Category:</span>
                  <span className="value">{file.productCategory || "N/A"}</span>
                </div>

                <div className="info-row">
                  <span className="label">Purchase Date:</span>
                  <span className="value">{file.purchaseDate || "N/A"}</span>
                </div>

                <div className="info-row">
                  <span className="label">Warranty End:</span>
                  <span className="value">{file.warrantyEndDate || "N/A"}</span>
                </div>
                <button
                  className="card-delete-btn"
                  onClick={() => handleDelete(file._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default Dashboard;
