import axios from "axios";

const api = axios.create({
 baseURL: "https://expense-tracker-1-ewb1.onrender.com/api"
});

export default api;