import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { changePassword, getUser, deactive } from 'store/slices/user';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';

const Security = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const [errors, setErrors] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { logout, user, isLoggedIn } = useAuth();

  const handleChangeClick = () => {
    dispatch(
      changePassword({ oldPassword, newPassword, confirmPassword }, () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Password is changed successfully.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
    );
  };

  const deactiveAccount = async () => {
    await dispatch(
      deactive(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Your account has been deactivated',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
    );
    await logout();
  };

  useEffect(() => {
    setErrors(userState.error);
  }, [userState]);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item sm={6} md={8}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SubCard title="Change Password">
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic9"
                      fullWidth
                      type={showOldPassword ? 'text' : 'password'}
                      label="Current password"
                      error={errors?.oldPassword}
                      helperText={errors?.oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              onMouseDown={() => setShowOldPassword(!showOldPassword)}
                            >
                              {showOldPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="outlined-basic10"
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      error={errors?.newPassword}
                      helperText={errors?.newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              onMouseDown={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="outlined-basic11"
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Re-enter New Password"
                      error={errors?.confirmPassword}
                      helperText={errors?.confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              onMouseDown={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row">
                      <AnimateButton>
                        <Button variant="contained" onClick={handleChangeClick}>
                          Change Password
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} md={4}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <SubCard title="Delete Account">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      To deactivate your account, first delete its resources. If you are the only owner of any teams, either assign another
                      owner or deactivate the team.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row">
                      <AnimateButton>
                        <Button
                          sx={{
                            color: theme.palette.error.main,
                            borderColor: theme.palette.error.main,
                            '&:hover': {
                              background: theme.palette.error.light + 25,
                              borderColor: theme.palette.error.main
                            }
                          }}
                          variant="outlined"
                          size="small"
                          onClick={() => setOpenDeleteModal(true)}
                        >
                          Deactivate Account
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {openDeleteModal && (
        <Dialog open={openDeleteModal} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Confirm Notification</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <DialogContentText>
                <Typography variant="body2" component="span">
                  Do you want to deactivate your account really?
                </Typography>
              </DialogContentText>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pr: 2.5 }}>
            <Button sx={{ color: theme.palette.error.dark }} onClick={() => setOpenDeleteModal(false)} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={deactiveAccount}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Security;
