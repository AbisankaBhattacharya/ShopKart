import api from "./axios";

const authApi = {
  async register(credentials) {
    const response = await api.post("/auth/register", credentials);
    return response.data.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },
};

export default authApi;
