import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import { iconPaths } from "../utils/iconPaths";

const Header = () => {
  return (
    <nav className="dashboard-nav">
      <div className="nav-content" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <h1 
          className="dashboard-title" 
          onClick={() => window.location.href = "/"} 
          style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          AssessPro 
        </h1>
        <span style={{
          backgroundColor: "#1E90FF", 
          color: "white", 
          fontSize: "0.8rem", 
          fontWeight: "bold", 
          padding: "2px 6px", 
          borderRadius: "4px", 
          marginLeft: "8px"
        }}>
        V.0 BETA
        </span>
      </div>
    </nav>
  );
}

export default Header;
