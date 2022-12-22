// material-ui
import { Avatar, Button, Grid, Stack, TextField, Typography, List, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, CardContent, Divider, Chip } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import DefaultAvatar from 'assets/images/auth/default.png';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "store";
import {getUser, saveProfile, uploadAvatar} from "store/slices/user";
import {openSnackbar} from "store/slices/snackbar";

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = () => {
  const dispatch = useDispatch();
  const { user, init } = useAuth();

  const { user : currentUser, error } = useSelector(state => state.user);

  const [ avatar, setAvatar ] = useState(DefaultAvatar);
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ job, setJob ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    dispatch(getUser(user?._id));
  }, [user]);

  useEffect(() => {
    setAvatar(currentUser.avatar ? 'http://localhost:5000/upload/avatar/'+currentUser.avatar : DefaultAvatar);
    setFirstName(currentUser.firstName ? currentUser.firstName : '');
    setLastName(currentUser.lastName ? currentUser.lastName : '');
    setJob(currentUser.job ? currentUser.job : '');
    setLocation(currentUser.location ? currentUser.location : '');
    setDescription(currentUser.description ? currentUser.description : '');
  }, [currentUser]);

  useEffect(() => {
    setErrors(error);
  }, [error])

  const handleFileChange = ({ target }) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(target.files[0]);
    fileReader.onload = (e) => {
      setAvatar(e.target.result);

      const data = new FormData();
      data.append('file', target.files[0])
      dispatch(uploadAvatar(data, init))
    };
  };

  const handleSaveProfileClick = () => {
    dispatch(
      saveProfile(
        { firstName, lastName, job, location, description },
        () => {
          dispatch(
            openSnackbar({
              open: true,
              message: "Profile is saved successfully.",
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          )
          dispatch(getUser(user._id));
        }
      )
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item md={6} xs={12}>
        <SubCard title="Profile Picture" contentSX={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Avatar alt="User 1" src={avatar} sx={{ width: 100, height: 100, margin: '0 auto' }} />
            </Grid>
            {
              !!!avatar && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" align="center">
                    Upload/Change Your Profile Image
                  </Typography>
                </Grid>
              )
            }
            <Grid item xs={12}>
              <AnimateButton>
                <Button variant="contained" color={!avatar ? "primary" : "secondary"} component={"label"} size="small">
                  {
                    !!avatar ? "Change file" : "Choose file"
                  }
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
                {
                  !!avatar && (
                    <Button variant={"outlined"} size="small" onClick={() => setAvatar(null)} sx={{ marginLeft: 1 }}> Reset </Button>
                  )
                }
              </AnimateButton>
            </Grid>
            <Grid item xs={12}>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton>
                  <ListItemIcon>
                    <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle2" align="right">
                      { currentUser?.email }
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon sx={{ fontSize: '1.3rem' }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="subtitle1">Username</Typography>} />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle2" align="right">
                      { currentUser?.username }
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Typography align="center" variant="h3">
                    { currentUser?.followers?.length }
                  </Typography>
                  <Typography align="center" variant="subtitle2">
                    Followers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="center" variant="h3">
                    { currentUser?.followings?.length }
                  </Typography>
                  <Typography align="center" variant="subtitle2">
                    Following
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item md={6} xs={12}>
        <SubCard title="Edit Account Details">
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                value={firstName}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setFirstName(e.target.value)}
                error={Boolean(errors?.firstName)}
                helperText={errors?.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                value={lastName}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setLastName(e.target.value)}
                error={Boolean(errors?.lastName)}
                helperText={errors?.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="job"
                fullWidth
                label="Job"
                value={job}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setJob(e.target.value)}
                error={Boolean(errors?.job)}
                helperText={errors?.job}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                fullWidth
                label="Location"
                value={location}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setLocation(e.target.value)}
                error={Boolean(errors?.location)}
                helperText={errors?.location}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                fullWidth
                multiline
                rows={3}
                value={description} InputLabelProps={{ shrink: true }}
                placeholder={'Description'}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row">
                <AnimateButton>
                  <Button variant="contained" onClick={handleSaveProfileClick}> Save </Button>
                </AnimateButton>
              </Stack>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default Profile;
