import axios from "axios";
import { getToken } from "./storage.js";

const token = getToken() ?? "";

export const api = axios.create({
    baseURL: "https://demometaway.vps-kinghost.net:8485/",
    headers: { Authorization: `Bearer ${token}` },
});

// const token = getToken() ?? "";

// console.log(token);

// api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// export default api;
