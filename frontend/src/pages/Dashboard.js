import React, { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("loggedInUser") || '{"name":"user"}');
  const username=user.name

  // Fetch files function
  const fetchFiles = async () => {
    const email = localStorage.getItem("loggedInUser");
    if (!email) return;
    const res = await fetch(
      `http://localhost:8080/dashboard/myfiles?email=${email}`
    );
    const data = await res.json();
    setFiles(
      data.map((file) => ({
        name: file.originalName,
        url: `/uploads/${file.fileName}`,
        type: file.fileName.endsWith(".pdf") ? "pdf" : "image",
      }))
    );
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
      const res = await fetch("http://localhost:8080/dashboard/upload", {
        method: "POST",
        body: formData,
      });

      // check if backend responded at all
      const text = await res.text();
      console.log("UPLOAD RESPONSE:", text);

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

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(`Selected: ${e.dataTransfer.files[0].name}`);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  return (
    <div className="dashboard-modern-container">
      <header className="dashboard-header">
        <h2>👋 Hello, {username}!</h2>
        <button className="dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

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
            {/* ...SVG and UI code... */}
            <p>Drag and drop to upload</p>
            <button
              type="button"
              className="dashboard-upload-btn"
              onClick={onButtonClick}
            >
              Upload
            </button>
            <div className="dashboard-upload-hint">(up to 10MB)</div>
            <div className="dashboard-upload-types">
              PNG, JPEG, PDF, MP4, AVI, TXT are supported
            </div>
            {file && (
              <div className="dashboard-upload-selected">
                Selected: {file.name}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="dashboard-upload-btn"
            style={{ marginTop: 16 }}
          >
            Submit
          </button>
        </form>
        {message && <div className="dashboard-message">{message}</div>}

        <div className="dashboard-files">
          {files.map((file, idx) => (
            <div className="dashboard-file-card" key={idx}>
              {file.type === "image" ? (
                <img
                  className="dashboard-file-img"
                  src={file.url}
                  alt={file.name}
                />
              ) : (
                <div
                  style={{ fontSize: 48, color: "#636e72", margin: "20px 0" }}
                >
                  📄
                </div>
              )}
              <div className="dashboard-file-name">{file.name}</div>
              <a
                className="dashboard-file-link"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
