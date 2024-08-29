import React, { useState } from "react";
import { iconPaths } from "../utils/iconPaths";

const ImportManagers = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("file recognized: " + file);

      const response = await fetch(
        "http://localhost:8080/shifter_api/managers/import",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setShowPopup(true);
        setError("");

        let progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                setShowPopup(false);
                setProgress(0);
                window.location.reload(); // Refresh the page after the popup closes

              }, 500);
            }
            return prevProgress + 5;
          });
        }, 100);
      } else {
        const errorData = await response.json();
        setError("Failed to upload file: " + errorData.message);
      }
    } catch (err) {
      setError("Failed to upload file: " + err.message);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#1b2a39", // Dark background as shown in the image
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            width: "350px",
            color: "white",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)"
          }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Données des managers importées avec succès!</h2>
            <div style={{
              width: "100%",
              height: "5px",
              backgroundColor: "#ccc",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "20px"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "green",
                transition: "width 0.1s ease"
              }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", filter: showPopup ? "blur(5px)" : "none" }}>
        <input
          type="file"
          onChange={handleFileChange}
          id="fileInput"
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" className="button" style={{ width: "24rem" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          >
            <path d={iconPaths.manager2} />
          </svg>
          Import Manager Data
        </label>
        <button className="upload-button" onClick={handleUpload} style={{width: "7rem", borderRadius:"9999px", backgroundColor:"#1E90FF", fontWeight:"bold", color:"white"}}>
          Charger
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ImportManagers;
