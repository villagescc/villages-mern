/**
 * axios setup to use mock service
 */

import axios from 'axios';
import { SERVER_URL } from '../config';
import { dispatch } from '../store';
import { LOGOUT } from '../store/actions';
import { setSession } from '../contexts/JWTContext';

const axiosServices = axios.create({
    baseURL: `${SERVER_URL}/api/`
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            setSession(null);
            dispatch({ type: LOGOUT });
        } else if (error.response.status === 400) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject((error.response && error.response.data) || error);
    }
);

export default axiosServices;
