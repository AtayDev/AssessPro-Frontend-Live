import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";
import "../styles/AddManager.css";
import Header from "./Header";

import ManagerService from "../services/ManagerService";

const AddManager = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitted:", { id, fname, lname, email });

    ManagerService.addManager({ id, fname, lname, email }, setShowPopup);
    console.log("after the add");
  };

  return (
    <div>
    <Header/>
      <div className="add-manager-page">
        {showPopup && (
          <div id="overlay">
            <div id="popupLoader">Manager created successfully</div>
            <div className="loading-bar"></div>
          </div>
        )}

        <Card className="add-manager-card">
          <h2 className="page-title">Créer un nouveau manager</h2>
          <form onSubmit={handleSubmit} className="add-manager-form">
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="id">ID:</label>
                <input
                  type="text"
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  placeholder="Enter ID"
                />
              </div>
              <label htmlFor="fname">Prénom:</label>
              <input
                type="text"
                id="fname"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
                placeholder="Entrer votre prénom"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lname">Nom:</label>
              <input
                type="text"
                id="lname"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
                placeholder="Entrer votre nom"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrer votre email"
              />
            </div>
            <div className="form-actions">
              <Button type="submit">Create New Manager</Button>
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="secondary-button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddManager;
