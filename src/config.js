// API Configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ktm-workshop-management-system.onrender.com'
  : 'http://localhost:3000';

export default API_URL;
