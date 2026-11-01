import React, { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/tokenUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://warranty-reminder-app.onrender.com";

function Dashboard() {
  const navigate = useNavigate();
  // const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [extractedData, setExtractedData] = useState({
    productName: "",
    purchaseDate: "",
    warrantyPeriod: "",
    warrantyEndDate: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const uploadLock = useRef(false);

  const [isSaving, setIsSaving] = useState(false);
  const saveLock = useRef(false);

  // const fetchFiles = async () => {
  //   const email = localStorage.getItem("loggedInUser");
  //   if (!email) return;

  //   const res = await fetch(
  //     `${API_BASE_URL}/dashboard/myfiles?email=${encodeURIComponent(email)}`,
  //   );
  //   const data = await res.json();

  //   setFiles(
  //     data.map((file) => ({
  //       _id: file._id,
  //       name: file.originalName,
  //       url: `/uploads/${file.fileName}`,
  //       type: "pdf",
  //       productName: file.productName?.fullLine,
  //       productCategory: file.productName?.productCategory,
  //       purchaseDate: file.purchaseDate,
  //       warrantyEndDate: file.warrantyEndDate,
  //     })),
  //   );
  // };

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

    // fetchFiles();
  }, [navigate]);

  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || '{"name":"user"}',
  );
  const username = user.name;

  const validateAndSetFile = (selectedFile, inputElement = null) => {
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only PDF, JPEG, and PNG files are allowed.");
      // setFile(null);
      setMessage("");
      if (inputElement) inputElement.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 5 MB.");
      // setFile(null);
      setMessage("");
      if (inputElement) inputElement.value = "";
      return;
    }

    // setFile(selectedFile);
    setMessage(`Selected: ${selectedFile.name}`);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0], e.target);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // duplicate uploads check hai
    if (uploadLock.current) return;

    // if (!file) {
    //   setMessage("Please select a file");
    //   return;
    // }

    // Lock
    uploadLock.current = true;
    setIsUploading(true);

    const formData = new FormData();
    // formData.append("file", file);
    formData.append("email", localStorage.getItem("loggedInUser"));

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log(text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (res.ok) {
        setMessage(data.message || "Upload successful");

        setExtractedData({
          productName: data.productFullName || "",
          purchaseDate: data.purchaseDate || "",
          warrantyPeriod: data.warrantyPeriod || "",
          warrantyEndDate: data.warrantyEndDate || "",
        });

        setShowConfirmation(true);
        // setFile(null);

        // await fetchFiles();
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      toast.error("Upload failed. Please check your connection and try again.");
    } finally {
      uploadLock.current = false;
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => inputRef.current.click();

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/dashboard/delete/${id}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       toast.success("Delete Successfully");
  //       // fetchFiles();
  //     } else {
  //       toast.error(data.message || "Delete failed");
  //     }
  //   } catch (err) {
  //     // console.error("DELETE ERROR:", err);
  //     toast.error("Error deleting file");
  //   }
  // };

  const handleConfirmSave = async () => {
    // Prevent duplicate save requests
    if (saveLock.current) return;

    // Lock immediately
    saveLock.current = true;
    setIsSaving(true);

    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));

      const res = await fetch(`${API_BASE_URL}/dashboard/saveWarranty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...extractedData,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save warranty");
        return;
      }

      console.log(data);
      toast.success(data.message || "Warranty saved successfully");

      setShowConfirmation(false);
    } catch (error) {
      console.error("SAVE ERROR:", error);
      toast.error("Unable to save warranty. Please try again.");
    } finally {
      saveLock.current = false;
      setIsSaving(false);
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
            accept=".pdf,.jpg,.jpeg,.png"
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
            <div className="dashboard-upload-hint">(up to 5MB)</div>
            <div className="dashboard-upload-types">PDF, JPEG, PNG</div>

            {/* {file && (
              <div className="dashboard-upload-selected">
                Selected: {file.name}
              </div>
            )} */}
          </div>

          <button
            type="submit"
            className="dashboard-upload-btn upload-submit-btn"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </button>
        </form>

        {message && <div className="dashboard-message">{message}</div>}

        {showConfirmation && (
          <div className="confirmation-box">
            <p className="confirmation-heading">Review Extracted Information</p>

            <div className="form-grid">
              <div className="field">
                <label className="Prodlabel">Product Name</label>
                <input
                  className="prodInput1"
                  type="text"
                  value={extractedData.productName}
                  onChange={(e) => {
                    setExtractedData({
                      ...extractedData,
                      productName: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="field">
                <label className="Prodlabel">Purchase Date</label>
                <input
                  className="prodInput1"
                  type="text"
                  placeholder="(e.g. 15/08/2025)"
                  value={extractedData.purchaseDate}
                  onChange={(e) => {
                    setExtractedData({
                      ...extractedData,
                      purchaseDate: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="field">
                <label className="Prodlabel">Warranty Period</label>
                <input
                  className="prodInput1"
                  type="text"
                  placeholder="e.g. 2 years or 12 months"
                  value={extractedData.warrantyPeriod}
                  onChange={(e) => {
                    setExtractedData({
                      ...extractedData,
                      warrantyPeriod: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="field">
                <label className="Prodlabel">Warranty End Date</label>
                <input
                  className="prodInput1"
                  type="text"
                  placeholder="(e.g. 15/08/2027)"
                  value={extractedData.warrantyEndDate}
                  onChange={(e) => {
                    setExtractedData({
                      ...extractedData,
                      warrantyEndDate: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <button
              className="savebtn"
              onClick={handleConfirmSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        )}

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
                  // onClick={() => handleDelete(file._id)}
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
