import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { split } from 'lodash';

import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import useAuth from 'hooks/useAuth';
// assets

// ==============================|| AUTH3 - CHECK MAIL ||============================== //

const VerifyMail = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { verify } = useAuth();
  const navigate = useNavigate();

  // console.log(location.pathname);
  const path = split(location.pathname, '/');
  // console.log(path);

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have verified email successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
    // setOpenModal(false);
  };

  // const CurrentPath = () => {
  //   const location = useLocation();

  //   return location.pathname;
  // };

  const init = async () => {
    try {
      await verify(path[3], path[4]).then(
        () => {
          successAction();
          setTimeout(() => {
            navigate('/login', { replace: true });
            const anchorTag = document.createElement('a')
            anchorTag.href = 'villages://villages.io/personal/setting'
            anchorTag.click()
          }, 1500);
        },
        (err) => {
          // setStatus({ success: false });
          // setErrors(err);
          // setSubmitting(false);
        }
      );
    } catch (err) {
      // if (scriptedRef.current) {
      //   setStatus({ success: false });
      //   setErrors({ submit: err.message });
      //   setSubmitting(false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="center" textAlign="center" spacing={2}>
                      <Grid item xs={12}>
                        <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                          Verifying you are ...
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                          It takes a few seconds. Please wait.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default VerifyMail;
