import axios from 'axios';

const defaultConfig = {
  timeout: 90000,
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json',
  },
};

const baseURL = process.env.REACT_APP_API_URL || null;

const apiInstance = axios.create({
  ...defaultConfig,
  baseURL,
});

export default apiInstance;
