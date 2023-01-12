/**
 * axios setup to use mock service
 */

import axios from 'axios';
import { SERVER_URL } from '../config'

const axiosServices = axios.create({
  baseURL: `${SERVER_URL}/api/`
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      alert();
    }
    Promise.reject((error.response && error.response.data) || error)
  }
);

export default axiosServices;
