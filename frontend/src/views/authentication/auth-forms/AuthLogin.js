import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { activeID } from 'store/slices/menu';

import { messaging, getToken, onMessage, hasFirebaseMessagingSupport } from 'firebaseConfig';
// import { geocodeByPlaceId } from 'react-places-autocomplete';
import { geocodeByLatLng } from 'react-google-places-autocomplete';
import { result } from 'lodash';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [checked, setChecked] = React.useState(true);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { login } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [token, setToken] = useState('');
  const [placeId, setPlaceId] = useState('');

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function fetchData(position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);

    await geocodeByLatLng({ lat: position?.coords?.latitude, lng: position?.coords?.longitude })
      .then((results) => {
        setPlaceId(results[results.length - 2].place_id);
      })
      .catch((error) => console.error(error));
  }

  const successCallback = (position) => {
    fetchData(position);
  };
  const errorCallback = (error) => {
    console.log(error);
  };
  useEffect(() => {
    if (hasFirebaseMessagingSupport) {
      // console.log(hasFirebaseMessagingSupport, "<== hasFirebaseMessagingSupport")
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
            .then((currentToken) => {
              if (currentToken) {
                setToken(currentToken);
              } else {
                console.log('No registration token available. Request permission to generate one.');
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
            });
        }
        else {
          console.log('Notification permission Rejected.');
        }
      })
    }
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log(token, placeId, latitude, longitude);
          try {
            await login(values.email, values.password, token, placeId, longitude, latitude).then(
              () => { },
              (err) => {
                setStatus({ success: false });
                setErrors(err);
                setSubmitting(false);
              }
            );
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
              <Typography
                variant="subtitle1"
                component={Link}
                to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/auth/forgot-password'}
                color="secondary"
                sx={{ textDecoration: 'none' }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign In
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

FirebaseLogin.propTypes = {
  loginProp: PropTypes.number
};

export default FirebaseLogin;
