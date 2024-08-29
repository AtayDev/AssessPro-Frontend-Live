class AgentService {
  static baseUrl = "http://localhost:8080/shifter_api";

  static getNumberOfAgents() {
    const url = `${this.baseUrl}/Agents/count`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        throw error;
      });
  }
  static getAllAgents() {
    const url = `${this.baseUrl}/Agents`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        throw error;
      });
  }

  static getEvalutaionById = async (id) => {
    const url = `${this.baseUrl}/Evaluation/Agent/${id}`;
    return await fetch(url);
  }
}


export default AgentService;
