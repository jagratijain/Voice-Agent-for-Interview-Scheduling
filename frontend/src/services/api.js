import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- Update if your backend runs on a different port or URL
});

export default api;
