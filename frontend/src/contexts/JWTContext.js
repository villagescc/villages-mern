import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

import { useDispatch, useSelector } from 'store';
// import services from 'utils/mockAdapter';

// axios.defaults.adapter = services.original
// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

export const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = serviceToken;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.account);

  const init = async () => {
    try {
      const serviceToken = window.localStorage.getItem('serviceToken');
      if (serviceToken && verifyToken(serviceToken)) {
        setSession(serviceToken);
        const response = await axios.get('/auth');
        const user = response.data;
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });
      } else {
        dispatch({
          type: LOGOUT
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: LOGOUT
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const login = async (email, password, deviceToken) => {
    const response = await axios.post('/auth/login', { email, password, deviceToken });
    const { serviceToken, user } = response.data;
    setSession(serviceToken);
    // dispatch({
    //   type: LOGIN,
    //   payload: {
    //     isLoggedIn: true,
    //     user
    //   }
    // });
    init();
  };

  const register = async (email, password, password2, firstName, lastName, username) => {
    // todo: this flow need to be recode as it not verified
    const response = await axios.post('auth/register', {
      email,
      password,
      password2,
      firstName,
      lastName,
      username
    });

    return response.data;
  };

  const verify = async (userid, token) => {
    console.log(userid, token);
    const response = await axios.get(`auth/verify/${userid}/${token}`);
    return response.data;
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const forgotPassword = async (email) => {
    console.log(email);
    const response = await axios.post('auth/forgot-password', { email });
    return response.data;
  };

  const resetPassword = async (id, token, password) => {
    console.log('id:' + id + 'token:' + token + 'password:' + password);
    const response = await axios.post(`auth/reset-password/${id}/${token}`, { password });
    return response.data;
  };
  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, init, login, logout, register, resetPassword, forgotPassword, updateProfile, verify }}>
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
