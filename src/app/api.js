import axios from 'axios';

const defaultConfig = {
  timeout: 90000,
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json',
  },
};

export const apiUrl = process.env.REACT_APP_API_URL || '';

const apiInstance = axios.create({
  ...defaultConfig,
  baseURL: apiUrl,
});

export default apiInstance;
