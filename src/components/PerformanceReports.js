import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import './PerformanceReports.css';

const ManagersList = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch('http://localhost:8080/shifter_api/Managers'); // Replace with your actual API endpoint
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="performance-card">
      <h2 className="card-title">Managers Performance Overview</h2>
      <div className="table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Manager Name</th>
              <th>Team Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.name}</td>
                <td>{manager.teamName}</td>
                <td>
                  <Button onClick={() => navigate(`/performance-reports/${manager.id}`)} className="view-button">View Team</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const TeamPerformance = () => {
  const { managerId } = useParams();
  const [teamAgents, setTeamAgents] = useState([]);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamPerformance = async () => {
      try {
        const managerResponse = await fetch(`http://localhost:8080/shifter_api/Manager/${managerId}`);
        const managerData = await managerResponse.json();
        setManager(managerData);
         
        //Change here
        const agentsResponse = await fetch(`http://localhost:8080/shifter_api/teams/${managerData.teamId}/agents`);
        const agentsData = await agentsResponse.json();
        setTeamAgents(agentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPerformance();
  }, [managerId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="performance-card">
      <h2 className="card-title">{manager.name}'s Team Performance</h2>
      <div className="table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teamAgents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.name}</td>
                <td>{agent.position}</td>
                <td>
                  <Button onClick={() => navigate(`/performance-reports/${managerId}/agent/${agent.id}`)} className="view-button">View Skills</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const AnimatedCircularProgressBar = ({ value, max = 10, min = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = ((currentValue - min) / (max - min)) * 100;
  const color = `hsl(${percentage * 1.2}, 100%, 50%)`;
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <div className="circular-progress-container">
      <svg className="circular-progress" viewBox="0 0 100 100">
        <circle className="circular-progress-bg" cx="50" cy="50" r="40" />
        <circle 
          className="circular-progress-fill" 
          cx="50" 
          cy="50" 
          r="40" 
          style={{
            strokeDasharray: strokeDasharray,
            strokeDashoffset: strokeDashoffset,
            stroke: color
          }}
        />
        <text x="50" y="50" className="circular-progress-text" textAnchor="middle" dy=".3em">
          {currentValue}
        </text>
      </svg>
    </div>
  );
};

const AgentSkills = () => {
  const { agentId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentEvaluations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/agents/${agentId}/evaluations`);
        const data = await response.json();
        setAgent(data.agent); // Assuming the agent's basic info is included
        setEvaluations(data.evaluations); // List of evaluations with dates and skills
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentEvaluations();
  }, [agentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="performance-card">
      <h2 className="card-title">{agent.name}</h2>
      <h3 className="agent-position">{agent.position}</h3>

      {evaluations.map((evaluation) => (
        <div key={evaluation.date} className="evaluation-section">
          <h4 className="evaluation-date">Evaluation Date: {evaluation.date}</h4>
          <ul className="skills-list">
            {Object.entries(evaluation.skills).map(([skill, value]) => (
              <li key={skill} className="skill-item">
                <span className="skill-name">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                <AnimatedCircularProgressBar value={value} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
};

const PerformanceReports = () => {
  return (
    <div className="performance-reports">
      <h1 className="page-title">Performance Reports</h1>
      <Routes>
        <Route path="/" element={<ManagersList />} />
        <Route path="/:managerId" element={<TeamPerformance />} />
        <Route path="/:managerId/agent/:agentId" element={<AgentSkills />} />
      </Routes>
    </div>
  );
};

export default PerformanceReports;
