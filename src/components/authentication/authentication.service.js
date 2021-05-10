import axios from "axios";

const API_URL = "http://3.97.206.109:8081/";

class AuthService {
  async login(username, password) {
    return await axios
      .post(API_URL + "login", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
            localStorage.setItem('user-info', JSON.stringify(response.data))
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user-info");
  }

  register(route, body) {
    return axios.post(API_URL + route, body);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user-info'));
  }
}

export default new AuthService();