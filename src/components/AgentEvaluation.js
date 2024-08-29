import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import SpiderChart from "./SpiderChart";
import "../styles/AgentEvaluation.css";

const AgentEvaluation = () => {
  const { id } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [initialEvaluations, setInitialEvaluations] = useState([]);
  const [agent, setAgent] = useState({});
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    handleFetchEvaluations();
    handleFetchAgent();
  }, [id]);

  useEffect(() => {
    filterEvaluationsByDate();
  }, [filterDate]);

  const handleFetchAgent = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/shifter_api/Agent/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setAgent(data);
      } else {
        console.error("Error fetching agent:", response.statusText);
      }
    } catch {
      console.error("Error fetching agent");
    }
  };

  const handleFetchEvaluations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/shifter_api/Evaluation/Agent/${id}`
      );
      if (response.ok) {
        const data = await response.json();

        const formattedData = data.map((evaluation) => {
          if (evaluation.date && evaluation.echeance) {
            const date = new Date(evaluation.date);
            const echeance = new Date(evaluation.echeance);
            evaluation.date = date.toISOString().split("T")[0];
            evaluation.echeance = echeance.toISOString().split("T")[0];
          }
          return evaluation;
        });

        setEvaluations(formattedData);
        setInitialEvaluations(JSON.parse(JSON.stringify(formattedData)));
      } else {
        console.error("Error fetching evaluations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  const filterEvaluationsByDate = () => {
    if (!filterDate) {
      setEvaluations(initialEvaluations);
      return;
    }

    const filteredEvaluations = initialEvaluations.filter(
      (evaluation) => evaluation.date === filterDate
    );

    setEvaluations(filteredEvaluations);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newEvaluations = [...evaluations];
    newEvaluations[index][name] = value;
    setEvaluations(newEvaluations);
  };

  const handleAddRow = () => {
    setEvaluations([...evaluations, createEmptyEvaluation()]);
  };

  const createEmptyEvaluation = () => ({
    date: "",
    fonction: "",
    competence: "",
    objectif: "",
    note: "",
    pointsFort: "",
    aAmeliorer: "",
    pilote: "",
    echeance: "",
    modeEvaluation: "Auto-évaluation",
    agent: { id },
    team: null,
  });

  const isModified = (initial, current) => {
    return JSON.stringify(initial) !== JSON.stringify(current);
  };

  const handleSubmit = async () => {
    const newEvaluations = evaluations.filter((evaluation) => !evaluation.id);

    const modifiedEvaluations = evaluations.filter(
      (evaluation, index) =>
        evaluation.id && isModified(initialEvaluations[index], evaluation)
    );

    if (newEvaluations.length === 0 && modifiedEvaluations.length === 0) {
      console.log("No new lines added");
      return;
    }

    const newPromises = newEvaluations.map(async (evaluation) => {
      const formattedEvaluation = {
        date: evaluation.date,
        fonction: evaluation.fonction,
        competence: evaluation.competence,
        objectif: parseInt(evaluation.objectif, 10),
        note: parseInt(evaluation.note, 10),
        pointsFort: evaluation.pointsFort,
        aAmeliorer: evaluation.aAmeliorer,
        pilote: evaluation.pilote,
        echeance: evaluation.echeance,
        modeEvaluation: evaluation.modeEvaluation || "Auto-évaluation",
        agent: {
          id: parseInt(id, 10),
        },
        team: null,
      };

      try {
        const response = await fetch(
          "http://localhost:8080/shifter_api/Evaluation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedEvaluation),
          }
        );
        if (!response.ok) {
          console.error("Error creating evaluation:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating evaluation:", error);
      }
    });

    const modifiedPromises = modifiedEvaluations.map(async (evaluation) => {
      const formattedEvaluation = {
        id: evaluation.id,
        date: evaluation.date,
        fonction: evaluation.fonction,
        competence: evaluation.competence,
        objectif: parseInt(evaluation.objectif, 10),
        note: parseInt(evaluation.note, 10),
        pointsFort: evaluation.pointsFort,
        aAmeliorer: evaluation.aAmeliorer,
        pilote: evaluation.pilote,
        echeance: evaluation.echeance,
        modeEvaluation: evaluation.modeEvaluation || "Auto-évaluation",
        agent: {
          id: parseInt(id, 10),
        },
        team: null,
      };

      try {
        const response = await fetch(
          `http://localhost:8080/shifter_api/Evaluation/${evaluation.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedEvaluation),
          }
        );
        if (!response.ok) {
          console.error("Error updating evaluation:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating evaluation:", error);
      }
    });

    try {
      await Promise.all([...newPromises, ...modifiedPromises]);
      console.log("All evaluations saved successfully!");
      handleFetchEvaluations();
    } catch (error) {
      console.error("Error saving evaluations:", error);
    }
  };

  const fonctionOptions = [
    "OPPT",
    "OP",
    "OPF",
    "CC",
    "DSE",
    "CED",
    "AGT",
    "CE",
  ];
  const competenceOptions = [
    "ADR",
    "CA",
    "DMP_MTI",
    "EP",
    "INCENDIE",
    "M3C",
    "MR",
    "PROCEDURE",
    "REGULISATION_EN_MANU",
    "RONDE",
    "SURVEILLANCE_SDC",
    "TS",
  ];

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p className="agent-title">
          {agent.fname} {agent.lname} - {agent.id}
        </p>
        <div className="filter-container" style={{ marginRight: "20px" }}>
          <label htmlFor="filter-date">Choisir une date: </label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>
      <div
        className="chart-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <SpiderChart data={evaluations} />
      </div>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Fonction</th>
              <th>Competence</th>
              <th>Objectif</th>
              <th>Note</th>
              <th>Points Fort</th>
              <th>A Ameliorer</th>
              <th>Pilote</th>
              <th>Echeance</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={evaluation.date || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <select
                    name="fonction"
                    value={evaluation.fonction || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  >
                    <option value="">Select Fonction</option>
                    {fonctionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="competence"
                    value={evaluation.competence || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  >
                    <option value="">Select Competence</option>
                    {competenceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="objectif"
                    value={evaluation.objectif || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="note"
                    value={evaluation.note || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="pointsFort"
                    value={evaluation.pointsFort || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="aAmeliorer"
                    value={evaluation.aAmeliorer || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <select
                    name="pilote"
                    value={evaluation.pilote || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  >
                    <option value="">Select Pilote</option>
                    {fonctionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    name="echeance"
                    value={evaluation.echeance || ""}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button onClick={handleAddRow}>+</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default AgentEvaluation;
