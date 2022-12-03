import React, {useEffect, useState} from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import {changePassword, getUser} from "store/slices/user";
import {useDispatch, useSelector} from "store";
import {openSnackbar} from "../../../store/slices/snackbar";

const Security = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userState = useSelector(state => state.user);

    const [ errors, setErrors ] = useState({})
    const [ oldPassword, setOldPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')

    const handleChangeClick = () => {
        dispatch(changePassword({ oldPassword, newPassword, confirmPassword }, () => {
            dispatch(
              openSnackbar({
                  open: true,
                  message: "Password is changed successfully.",
                  variant: 'alert',
                  alert: {
                      color: 'success'
                  },
                  close: false
              })
            )
        }));
    }

    useEffect(() => {
        setErrors(userState.error);
    }, [userState])

    return (
      <Grid container spacing={gridSpacing}>
          <Grid item sm={6} md={8}>
              <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                      <SubCard title="Change Password">
                          <Grid container spacing={gridSpacing}>
                              <Grid item xs={12}>
                                  <TextField id="outlined-basic9" fullWidth type="password" label="Current password" error={errors?.oldPassword} helperText={errors?.oldPassword} onChange={e => setOldPassword(e.target.value)}/>
                              </Grid>
                              <Grid item xs={6}>
                                  <TextField id="outlined-basic10" fullWidth type="password" label="New Password" error={errors?.newPassword} helperText={errors?.newPassword} onChange={e => setNewPassword(e.target.value)}/>
                              </Grid>
                              <Grid item xs={6}>
                                  <TextField id="outlined-basic11" fullWidth type="password" label="Re-enter New Password" error={errors?.confirmPassword} helperText={errors?.confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                              </Grid>
                              <Grid item xs={12}>
                                  <Stack direction="row">
                                      <AnimateButton>
                                          <Button variant="contained" onClick={handleChangeClick}>Change Password</Button>
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
                                      To deactivate your account, first delete its resources. If you are the only owner of any teams,
                                      either assign another owner or deactivate the team.
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
    );
};

export default Security;
