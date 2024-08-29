class TeamService {
  static baseUrl = "http://localhost:8080/shifter_api";

  static getNumberOfTeams() {
    const url = `${this.baseUrl}/Teams/count`;

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
  static getAllTeams() {
    const url = `${this.baseUrl}/Teams`;
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
}

export default TeamService;
