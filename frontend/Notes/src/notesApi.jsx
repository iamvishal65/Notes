import axios from "axios";

// Base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Example API call to get notes
export const getNotes = async () => {
  const response = await axios.get(`${API_URL}/api/notes`);
  return response.data;
};
