import React from "react";
import AdminDashboard from "./AdminDashboard";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AddManager from "./components/AddManager";
import PerformanceReports from "./components/PerformanceReports";
import DynamicTable from "./components/DynamicTable";
import AgentEvaluation from "./components/AgentEvaluation";
import DashboardContent from "./AdminDashboard";
import TeamEvaluation from "./components/TeamEvaluation";

function App() {
  // To add later: <Route path="/performance-reports/*" element={<PerformanceReports />} />

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
        <Route path="/performance-reports/*" element={<DashboardContent />} />
        <Route path="/add-manager" element={<AddManager />} />
        <Route path="/table/:type" element={<DynamicTable />} />
        <Route path="/agents/:id" element={<AgentEvaluation />} />
        <Route path="/teams/:id" element={<TeamEvaluation />} />

      </Routes>
    </Router>
  );
}

export default App;
