import React, { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/tokenUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Shield,
  ShieldCheck,
  Clock3,
  AlertCircle,
  FilePlus2,
  CloudUpload,
  FileText,
  Mail,
  Package,
  Trash2,
} from "lucide-react";

const API_BASE_URL = "https://warranty-reminder-app.onrender.com";

function Dashboard() {
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const uploadLock = useRef(false);
  const saveLock = useRef(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [extractedData, setExtractedData] = useState({
    productName: "",
    purchaseDate: "",
    warrantyPeriod: "",
    warrantyEndDate: "",
  });

  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenExpired(token)) {
      logout();
      return;
    }

    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  // User information
  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || '{"name":"User","email":""}',
  );

  const username = user.name || "User";

  // Fetch warranties belonging to the logged-in user
  const fetchUserFiles = async () => {
    if (!user.email) {
      setIsLoadingFiles(false);
      return;
    }

    setIsLoadingFiles(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/dashboard/myfiles?email=${encodeURIComponent(user.email)}`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to fetch warranties.");
      }

      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH WARRANTIES ERROR:", error);
      toast.error(error.message || "Unable to load warranties.");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // cal warranty stats
  const getDaysUntilExpiry = (dateString) => {
    if (!dateString) return null;

    const expiryDate = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(expiryDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  const getProductName = (file) =>
    file.productName?.fullLine ||
    file.productName?.productCategory ||
    "Unknown product";

  const activeFiles = files.filter((file) => {
    const days = getDaysUntilExpiry(file.warrantyEndDate);
    return days !== null && days > 30;
  });

  const expiringFiles = files
    .filter((file) => {
      const days = getDaysUntilExpiry(file.warrantyEndDate);
      return days !== null && days >= 0 && days <= 30;
    })
    .sort(
      (a, b) =>
        getDaysUntilExpiry(a.warrantyEndDate) -
        getDaysUntilExpiry(b.warrantyEndDate),
    );

  const expiredFiles = files.filter((file) => {
    const days = getDaysUntilExpiry(file.warrantyEndDate);
    return days !== null && days < 0;
  });

  // Fetch after the dashboard loads
  useEffect(() => {
    fetchUserFiles();
  }, [user.email]);

  // File validation
  const validateAndSetFile = (file, inputElement = null) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPEG, and PNG files are allowed.");

      setSelectedFile(null);
      setMessage("");

      if (inputElement) inputElement.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 5 MB.");

      setSelectedFile(null);
      setMessage("");

      if (inputElement) inputElement.value = "";

      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  // Browse files
  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0], e.target);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  // Drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Upload invoice and extract information
  const handleUpload = async (e) => {
    e.preventDefault();

    if (uploadLock.current) return;

    if (!selectedFile) {
      toast.error("Please select an invoice first.");
      return;
    }

    uploadLock.current = true;
    setIsUploading(true);

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("email", user.email);

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Upload failed.");
        return;
      }

      setMessage(data.message || "Invoice processed successfully.");

      setExtractedData({
        productName: data.productFullName || "",
        purchaseDate: data.purchaseDate || "",
        warrantyPeriod: data.warrantyPeriod || "",
        warrantyEndDate: data.warrantyEndDate || "",
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      toast.error("Upload failed. Please check your connection and try again.");
    } finally {
      uploadLock.current = false;
      setIsUploading(false);
    }
  };

  // Update extracted information
  const handleExtractedChange = (e) => {
    const { name, value } = e.target;

    setExtractedData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save confirmed warranty
  const handleConfirmSave = async () => {
    if (saveLock.current) return;

    saveLock.current = true;
    setIsSaving(true);

    try {
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
        toast.error(data.message || "Failed to save warranty.");
        return;
      }

      toast.success(data.message || "Warranty saved successfully.");

      await fetchUserFiles();

      setShowConfirmation(false);
      setSelectedFile(null);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("SAVE ERROR:", error);

      toast.error("Unable to save warranty. Please try again.");
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);

    setExtractedData({
      productName: "",
      purchaseDate: "",
      warrantyPeriod: "",
      warrantyEndDate: "",
    });
  };

  return (
    <div className="dashboard-modern-container">
      <main className="dashboard-content">
        {/* Welcome section */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">YOUR WARRANTY OVERVIEW</p>

            <h1 className="dashboard-header">Welcome back, {username}</h1>

            <p className="dashboard-subtitle">
              Here's an overview of your warranty protection.
            </p>
          </div>
        </section>

        {/* Summary cards */}
        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-icon stat-icon-total">
              <Shield size={21} />
            </div>

            <h2>{isLoadingFiles ? "—" : files.length}</h2>
            <p>Total Warranties</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon stat-icon-active">
              <ShieldCheck size={21} />
            </div>

            <h2>{isLoadingFiles ? "—" : activeFiles.length}</h2>
            <p>Active Warranties</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon stat-icon-expiring">
              <Clock3 size={21} />
            </div>

            <h2>{isLoadingFiles ? "—" : expiringFiles.length}</h2>
            <p>Expiring Soon</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon stat-icon-expired">
              <AlertCircle size={21} />
            </div>

            <h2>{isLoadingFiles ? "—" : expiredFiles.length}</h2>
            <p>Expired</p>
          </div>
        </section>

        {/* Upload and expiring warranties */}
        <section className="dashboard-main-grid">
          {/* Upload section */}
          <div className="dashboard-panel upload-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Add a New Warranty</h2>

                <p>
                  Upload your invoice and let us extract your warranty details.
                </p>
              </div>

              <div className="panel-heading-icon">
                <FilePlus2 size={21} />
              </div>
            </div>

            <form
              id="dashboard-upload-form"
              onSubmit={handleUpload}
              className={`dashboard-upload-area ${
                dragActive ? "drag-active" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="dashboard-upload-input"
                onChange={handleFileChange}
              />

              <div className="upload-cloud-icon">
                <CloudUpload size={27} />
              </div>

              <h3>Drag & drop your invoice here</h3>

              <p>PDF, JPG or PNG — max 5 MB</p>

              <span className="upload-or">or</span>

              <button
                type="button"
                className="dashboard-upload-btn"
                onClick={onButtonClick}
              >
                Browse Files
              </button>

              {selectedFile && (
                <div className="dashboard-selected-file">
                  <FileText size={19} />
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </form>

            <button
              type="submit"
              form="dashboard-upload-form"
              className="dashboard-submit-btn"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Processing invoice..." : "Submit Invoice"}
            </button>

            {message && <p className="dashboard-message">{message}</p>}
          </div>

          {/* Expiring soon section */}
          <div className="dashboard-panel expiring-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Expiring Soon</h2>
                <p>Approaching expiry dates</p>
              </div>
            </div>

            <div className="dashboard-expiring-list">
              {isLoadingFiles ? (
                <p className="dashboard-list-message">Loading warranties...</p>
              ) : expiringFiles.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon">
                    <Clock3 size={24} />
                  </div>

                  <h3>No upcoming expiries</h3>

                  <p>Your upcoming warranty expiries will appear here.</p>
                </div>
              ) : (
                expiringFiles.slice(0, 4).map((file) => {
                  const days = getDaysUntilExpiry(file.warrantyEndDate);

                  return (
                    <div className="dashboard-expiring-item" key={file._id}>
                      <div className="expiring-item-icon">
                        <Clock3 size={18} />
                      </div>

                      <div className="expiring-item-details">
                        <strong>{getProductName(file)}</strong>
                        <small>{file.warrantyEndDate}</small>
                      </div>

                      <span className="expiring-days">
                        {days === 0 ? "Today" : `${days}d`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="dashboard-reminder-info">
              <div className="reminder-icon">
                <Mail size={18} />
              </div>

              <div>
                <h4>Reminder Activity</h4>
                <p>Reminder information will appear here when available.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Extracted information confirmation */}
        {showConfirmation && (
          <section className="dashboard-panel confirmation-box">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Review Extracted Information</h2>

                <p>
                  Check the details extracted from your invoice before saving.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="productName">Product Name</label>

                <input
                  id="productName"
                  name="productName"
                  type="text"
                  value={extractedData.productName}
                  onChange={handleExtractedChange}
                />
              </div>

              <div className="field">
                <label htmlFor="purchaseDate">Purchase Date</label>

                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="text"
                  placeholder="e.g. 15/08/2025"
                  value={extractedData.purchaseDate}
                  onChange={handleExtractedChange}
                />
              </div>

              <div className="field">
                <label htmlFor="warrantyPeriod">Warranty Period</label>

                <input
                  id="warrantyPeriod"
                  name="warrantyPeriod"
                  type="text"
                  placeholder="e.g. 2 years or 12 months"
                  value={extractedData.warrantyPeriod}
                  onChange={handleExtractedChange}
                />
              </div>

              <div className="field">
                <label htmlFor="warrantyEndDate">Warranty End Date</label>

                <input
                  id="warrantyEndDate"
                  name="warrantyEndDate"
                  type="text"
                  placeholder="e.g. 15/08/2027"
                  value={extractedData.warrantyEndDate}
                  onChange={handleExtractedChange}
                />
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                type="button"
                className="dashboard-cancel-btn"
                onClick={handleCancelConfirmation}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="dashboard-save-btn"
                onClick={handleConfirmSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Confirm & Save"}
              </button>
            </div>
          </section>
        )}

        {/* All warranties */}
        <section className="dashboard-panel warranties-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Your Warranties</h2>

              <p>Manage all your registered products in one place.</p>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="dashboard-table-empty">
                      No warranties found. Upload an invoice to get started.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file._id}>
                      <td>
                        <strong>{getProductName(file)}</strong>

                        <small>Purchased: {file.purchaseDate || "N/A"}</small>
                      </td>

                      <td>{file.warrantyEndDate || "N/A"}</td>

                      <td>—</td>

                      <td>
                        <button
                          type="button"
                          className="dashboard-delete-btn"
                          disabled
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
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
