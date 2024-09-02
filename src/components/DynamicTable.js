import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DynamicTable.css";
import Header from "./Header";

const DynamicTable = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [dropdowns, setDropdowns] = useState({});

  useEffect(() => {
    let fetchData;

    switch (type) {
      case "managers":
        fetchData = fetchManagers;
        break;
      case "teams":
        fetchData = fetchTeams;
        break;
      case "agents":
        fetchData = fetchAgents;
        break;
      default:
        fetchData = () => Promise.resolve([]);
        break;
    }

    fetchData().then((data) => {
      setData(data);
      setFilteredData(data);
      initializeDropdowns(data);
    });
  }, [type]);

  useEffect(() => {
    filterData();
  }, [filters]);

  const initializeDropdowns = (data) => {
    const newDropdowns = {};
    if (type === "managers" || type === "agents") {
      newDropdowns.id = [...new Set(data.map((item) => item.id))];
      newDropdowns.fname = [...new Set(data.map((item) => item.fname))];
      newDropdowns.lname = [...new Set(data.map((item) => item.lname))];
      newDropdowns.email = [...new Set(data.map((item) => item.email))];
    } else if (type === "teams") {
      newDropdowns.id = [...new Set(data.map((item) => item.id))];
      newDropdowns.manager = [
        ...new Set(
          data.map((item) => `${item.manager.fname} ${item.manager.lname}`)
        ),
      ];
      newDropdowns.tranche = [
        ...new Set(data.map((item) => item.id.toString().charAt(0))),
      ];
      newDropdowns.agents = [
        ...new Set(
          data.flatMap((item) =>
            item.agents.map(
              (agent) => `XX${agent.id} - ${agent.fname} ${agent.lname}`
            )
          )
        ),
      ];
      newDropdowns.numberOfAgents = [
        ...new Set(data.map((item) => item.agents.length)),
      ];
    }
    setDropdowns(newDropdowns);
  };

  const fetchManagers = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/shifter_api/Managers`).then(
      (res) => res.json()
    );
  };

  const fetchTeams = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/shifter_api/Teams`).then(
      (res) => res.json()
    );

    const teamsWithManagers = await Promise.all(
      res.map(async (team) => {
        const manager = await fetchManagerOfTeam(team.id);
        return { ...team, manager };
      })
    );

    return teamsWithManagers;
  };

  const fetchManagerOfTeam = async (id) => {
    return await fetch(
      `${process.env.REACT_APP_API_URL}/shifter_api/Team/${id}/manager`
    ).then((res) => res.json());
  };

  const fetchAgents = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/shifter_api/Agents`).then((res) =>
      res.json()
    );
  };

  const navigate = useNavigate();

  const handleIdClick = (id) => {
    navigate(`/${type}/${id}`);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const filterData = () => {
    let filtered = data;

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((item) => {
          const filterValue = filters[key];

          if (key === "tranche") {
            // Tranche is derived from the team ID
            return item.id.toString().startsWith(filterValue);
          }

          if (key === "agents") {
            // Check if any agent matches the filter value
            return item.agents.some((agent) =>
              `XX${agent.id} - ${agent.fname} ${agent.lname}`
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            );
          }

          if (key === "numberOfAgents") {
            // Compare number of agents
            return item.agents.length === parseInt(filterValue, 10);
          }

          if (typeof item[key] === "number") {
            // Handle numeric filtering
            return item[key] === parseInt(filterValue, 10);
          }

          if (typeof item[key] === "string") {
            // Handle string-based filtering
            return item[key].toLowerCase().includes(filterValue.toLowerCase());
          }

          if (key === "manager") {
            // Filter by manager's full name
            return (
              `${item.manager.fname} ${item.manager.lname}` === filterValue
            );
          }

          return false;
        });
      }
    });

    setFilteredData(filtered);
  };

  const renderTableHeaders = () => {
    const renderDropdown = (column) => (
      <div className="dropdown">
        <button className="dropbtn">▼</button>
        <div className="dropdown-content">
          <div onClick={() => handleFilterChange(column, "")}>All</div>
          {dropdowns[column]?.map((value, index) => (
            <div key={index} onClick={() => handleFilterChange(column, value)}>
              {value}
            </div>
          ))}
        </div>
      </div>
    );

    switch (type) {
      case "managers":
      case "agents":
        return (
          <>
            <th>
              <div className="column-filter">
                <span>ID</span> {renderDropdown("id")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Prénom</span> {renderDropdown("fname")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Nom</span> {renderDropdown("lname")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Email</span> {renderDropdown("email")}
              </div>
            </th>
          </>
        );
      case "teams":
        return (
          <>
            <th>
              <div className="column-filter">
                <span>Equipe</span> {renderDropdown("id")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Tranche</span> {renderDropdown("tranche")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Manager</span> {renderDropdown("manager")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Agents</span> {renderDropdown("agents")}
              </div>
            </th>
            <th>
              <div className="column-filter">
                <span>Number Of Agents</span> {renderDropdown("numberOfAgents")}
              </div>
            </th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return filteredData.map((item) => {
      switch (type) {
        case "managers":
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.fname}</td>
              <td>{item.lname}</td>
              <td>{item.email}</td>
            </tr>
          );
        case "agents":
          return (
            <tr key={item.id}>
              <td
                onClick={() => handleIdClick(item.id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {item.id}
              </td>
              <td>{item.fname}</td>
              <td>{item.lname}</td>
              <td>{item.email}</td>
            </tr>
          );
        case "teams":
          return (
            <tr key={item.id}>
              <td>
                {" "}
                {item.id} -{" "}
                <span
                  onClick={() => handleIdClick(item.id)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Evaluation Collective
                </span>
              </td>
              <td>{item.id.toString().split("")[0]}</td>
              <td>
                {item.manager.fname} {item.manager.lname}
              </td>
              <td>
                {item.agents.map((agent, index) => (
                  <span key={agent.id}>
                    <span>
                      XX{agent.id} - {agent.fname} {agent.lname} -{" "}
                      <span
                        onClick={() => navigate(`/agents/${agent.id}`)}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        Evaluation Individuelle
                      </span>
                    </span>
                    {index < item.agents.length - 1 && <br />}
                  </span>
                ))}
              </td>
              <td>{item.agents.length}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="table-container">
        <h2> {type.charAt(0).toUpperCase() + type.slice(1) == "Teams"? "Equipes": type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <table className="styled-table">
          <thead>
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
