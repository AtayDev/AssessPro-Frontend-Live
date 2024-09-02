import React, { useState, useEffect } from "react";
import { iconPaths } from "../utils/iconPaths";

const ImportTeams = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("MyFile Teams : " + file);
  }, [file]);

  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    console.log("file state before upload:", file); // Check if file is available

    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/shifter_api/teams/import`,
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
        setSuccess("");
      }
    } catch (err) {
      setError("Failed to upload file: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div className="import-teams-container" style={{ position: "relative" }}>
      {showPopup && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: "#1b2a39",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "350px",
              color: "white",
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
            Données des équipes importées avec succès!
            </h2>
            <div
              style={{
                width: "100%",
                height: "5px",
                backgroundColor: "#ccc",
                borderRadius: "5px",
                overflow: "hidden",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "green",
                  transition: "width 0.1s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className="import-teams"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          filter: showPopup ? "blur(5px)" : "none",
        }}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label
          htmlFor="fileInput"
          className="button"
          style={{ width: "24rem" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          >
            <path d={iconPaths.users} />
          </svg>
          Importer les données des équipes
        </label>
        <button className="upload-button" onClick={handleUpload} style={{width: "7rem", borderRadius:"9999px", backgroundColor:"#1E90FF", fontWeight:"bold", color:"white"}}>
          Charger
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </div>
  );
};

export default ImportTeams;
