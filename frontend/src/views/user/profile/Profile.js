// material-ui
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Divider
} from '@mui/material';
import { WithContext as ReactTags } from 'react-tag-input';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { SERVER_URL } from 'config';
// assets
import DefaultAvatar from 'assets/images/auth/default.png';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'store';
import { getUser, saveProfile, uploadAvatar } from 'store/slices/user';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| PROFILE 3 - PROFILE ||============================== //
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, init } = useAuth();

  const { user: currentUser, error } = useSelector((state) => state.user);

  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [job, setJob] = useState('');
  const [location, setLocation] = useState({});
  const [description, setDescription] = useState('');
  const [tags, setTags] = React.useState([]);
  const [tagSuggestion, setTagSuggestion] = React.useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getUser(user?._id));
  }, [user]);

  useEffect(() => {
    console.log('currentUser', currentUser);
    setAvatar(currentUser?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + currentUser?.profile?.avatar : DefaultAvatar);
    setFirstName(currentUser.firstName ? currentUser.firstName : '');
    setLastName(currentUser.lastName ? currentUser.lastName : '');
    setJob(currentUser.profile?.job ? currentUser.profile.job : '');
    console.log(currentUser?.profile?.placeId);
    // console.log(currentUser.placeId);
    if (currentUser && currentUser.profile && currentUser.profile.placeId) {
      geocodeByPlaceId(currentUser.profile.placeId).then((results) =>
        setLocation({
          placeId: currentUser.profile.placeId,
          description: results[0].formatted_address
        })
      );
    }
    setDescription(currentUser.profile?.description ? currentUser.profile.description : '');
  }, [currentUser]);

  useEffect(() => {
    setErrors(error);
  }, [error]);

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (newTag) => {
    setTags([...tags, newTag]);
  };

  const handleFileChange = ({ target }) => {
    console.log(target);
    const fileReader = new FileReader();

    fileReader.readAsDataURL(target.files[0]);
    fileReader.onload = (e) => {
      setAvatar(e.target.result);

      const data = new FormData();
      data.append('file', target.files[0]);
      dispatch(uploadAvatar(data, init));
    };
  };

  const handleSaveProfileClick = () => {
    var placeId = location.placeId;
    dispatch(
      saveProfile({ firstName, lastName, job, placeId, description }, () => {
        console.log(firstName);
        console.log(lastName);
        console.log(job);
        console.log(placeId);
        console.log(description);

        dispatch(
          openSnackbar({
            open: true,
            message: 'Profile is saved successfully.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        dispatch(getUser(user._id));
      })
    );
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item md={6} xs={12}>
        <SubCard title="Profile Picture" contentSX={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Avatar alt="User 1" src={avatar} sx={{ width: 100, height: 100, margin: '0 auto' }} />
            </Grid>
            {!!!avatar && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" align="center">
                  Upload/Change Your Profile Image
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button variant="contained" color={!avatar ? 'primary' : 'secondary'} component={'label'} size="small">
                  {!!avatar ? 'Change file' : 'Choose file'}
                  <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} hidden />
                </Button>
                {!!avatar && (
                  <Button variant={'outlined'} size="small" onClick={() => setAvatar(null)} sx={{ marginLeft: 1 }}>
                    {' '}
                    Reset{' '}
                  </Button>
                )}
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
                      {currentUser?.email}
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
                      {currentUser?.username}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Typography align="center" variant="h3">
                    {currentUser?.followers?.length}
                  </Typography>
                  <Typography align="center" variant="subtitle2">
                    Followers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="center" variant="h3">
                    {currentUser?.followings?.length}
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
              <PlacesAutocomplete
                value={location.description || ''}
                onChange={(address) => setLocation({ description: address, placeId: '' })}
              >
                {({ getInputProps, suggestions }) => {
                  return (
                    <Autocomplete
                      id="location"
                      value={location}
                      sx={{ width: '100%' }}
                      options={suggestions.map((suggestion) => ({
                        description: suggestion.description,
                        placeId: suggestion.placeId
                      }))}
                      autoHighlight
                      getOptionLabel={(option) => option.description || ''}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          onClick={() => {
                            setLocation(option);
                          }}
                        >
                          {option.description}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: 'location-search-input'
                          })}
                        />
                      )}
                    />
                  );
                }}
              </PlacesAutocomplete>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                fullWidth
                multiline
                rows={3}
                value={description}
                InputLabelProps={{ shrink: true }}
                placeholder={'Description'}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <ReactTags
                tags={tags}
                suggestions={tagSuggestion.map((suggestion) => ({
                  id: suggestion.title,
                  text: suggestion.title
                }))}
                handleDelete={handleDeleteTag}
                handleAddition={handleAddition}
                delimiters={delimiters}
                placeholder={'Tags'}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row">
                <AnimateButton>
                  <Button variant="contained" onClick={handleSaveProfileClick}>
                    Save
                  </Button>
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
