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
import { openSnackbar } from "store/slices/snackbar";
import { messaging, getToken, onMessage, hasFirebaseMessagingSupport } from 'firebaseConfig';
// import { geocodeByPlaceId } from 'react-places-autocomplete';
import { geocodeByLatLng } from 'react-google-places-autocomplete';
import { result } from 'lodash';
import axios from 'axios';
import { dispatch } from 'store';
import ReCAPTCHA from 'react-google-recaptcha';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const reCaptchaRef = useRef(null)
  const [checked, setChecked] = React.useState(true);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { login, resendVerificationMail } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [token, setToken] = useState('');
  const [placeId, setPlaceId] = useState('');

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  // async function fetchData(position) {
  //   setLatitude(position.coords.latitude);
  //   setLongitude(position.coords.longitude);

  //   await geocodeByLatLng({ lat: position?.coords?.latitude, lng: position?.coords?.longitude })
  //     .then((results) => {
  //       setPlaceId(results[results.length - 2].place_id);
  //     })
  //     .catch((error) => console.error(error));
  // }

  // const successCallback = (position) => {
  //   fetchData(position);
  // };
  // const errorCallback = (error) => {
  //   console.log(error);
  // };
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
    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  const handleEmailVerification = async (email) => {
    await resendVerificationMail(email).then((result) => {
      dispatch(
        openSnackbar({
          open: true,
          message: result.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      )
    }).catch((err) => {
      console.log(err)
    });
  }
  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
          captcha: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          captcha: Yup.string().required('Captcha is required').nullable()
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting, setValues }) => {
          try {
            await login(values.email, values.password, token, placeId, longitude, latitude, values.captcha).then(
              () => { },
              (err) => {
                if (err.captcha) {
                  reCaptchaRef.current.reset()
                }
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setValues }) => (
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
                style={{ fontSize: '16px' }}
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
            <Stack direction="column" alignItems="center" justifyContent="start" spacing={1}>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                onChange={(captcha) => setValues({ ...values, captcha })}
                name='captcha'
                ref={reCaptchaRef}
                onReset={() => setValues({ ...values, captcha: "" })}
              />
              {touched.captcha && errors.captcha && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.captcha}
                </FormHelperText>
              )}
            </Stack>
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
            {errors?.email === "Email is not verified" && !!!errors?.isEmailVerified && (<Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation onClick={() => handleEmailVerification(values.email)} fullWidth size="large" variant="contained" color="secondary">
                  Resend Verfication Email
                </Button>
              </AnimateButton>
            </Box>)}
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
