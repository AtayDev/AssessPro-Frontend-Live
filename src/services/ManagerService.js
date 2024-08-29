// ManagerService.js
class ManagerService {
  static baseUrl = "http://localhost:8080/shifter_api";

  // Fetch the number of students
  static getNumberOfManagers() {
    const url = `${this.baseUrl}/Managers/count`;

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

  // Fetch all students
  static getAllManagers() {
    const url = `${this.baseUrl}/Managers`;
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

  // Fetch a student by ID
  static getManagerById(id) {
    const url = `${this.baseUrl}/Manager/${id}`;

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

  // Add a new student
  static addManager(manager, setShowPopup) {

    const url = `${this.baseUrl}/Manager`;
    //SEND A POST REQUEST to add the new manager
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manager),
    })
      .then((response) => {

        console.log(response);
        if (response.ok) {
          // If response is OK, try to parse JSON
          return response.json().catch(() => ({})); // Return an empty object if parsing fails
        } else {
          // If response is not OK, throw an error
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("data", data);
        setShowPopup(true);

        //alert("Manager created successfully!");
        setTimeout(() => {
          setShowPopup(false);

          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        console.log("error", error);
        alert("Failed to create manager.");
      });
  }

  // Delete a student by ID
  static deleteManager(id) {
    const url = `${this.baseUrl}/${id}`;

    return fetch(url, {
      method: "DELETE",
    })
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

export default ManagerService;
