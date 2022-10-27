/**
 * axios setup to use mock service
 */

import axios from 'axios';

const axiosServices = axios.create({
  baseURL: 'http://localhost:5000/api/'
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || error)
);

export default axiosServices;
