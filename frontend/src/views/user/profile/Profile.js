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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { WithContext as ReactTags } from 'react-tag-input';
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';

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
import { geocodeByLatLng } from 'react-google-places-autocomplete';
import { useNavigate } from 'react-router-dom';

// ==============================|| PROFILE 3 - PROFILE ||============================== //
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, init } = useAuth();
  useEffect(() => {
    dispatch(getUser(user?._id));
  }, [user]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function fetchData(position) {
    await geocodeByLatLng({ lat: position?.coords?.latitude, lng: position?.coords?.longitude })
      .then((results) => {
        // console.log(results)
        // console.log(results[results.length - 2].place_id, "Place id");
        if (results?.length && results[results.length - 2].place_id) {
          geocodeByPlaceId(results[results.length - 2].place_id).then((geodata) => {
            console.log(geodata)
            setLocation({
              placeId: results[results.length - 2].place_id,
              description: geodata[0].formatted_address
            })
          }
          );
        }
      })
      .catch((error) => console.error(error));
  }

  const successCallback = (position) => {
    fetchData(position);
  };
  const errorCallback = (error) => {
    console.log(error);
    handleClickOpen()
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [])

  const { user: currentUser, error } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [job, setJob] = useState('');
  const [location, setLocation] = useState({});
  const [description, setDescription] = useState('');
  const [tags, setTags] = React.useState([]);
  const [tagSuggestion, setTagSuggestion] = React.useState([]);
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAvatar(currentUser?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + currentUser?.profile?.avatar : DefaultAvatar);
    setFirstName(currentUser.firstName ? currentUser.firstName : '');
    setLastName(currentUser.lastName ? currentUser.lastName : '');
    setJob(currentUser.profile?.job ? currentUser.profile.job : '');
    setZipCode(currentUser.profile?.zipCode ? currentUser.profile.zipCode : '');
    setPhoneNumber(currentUser.profile?.phoneNumber ? currentUser.profile.phoneNumber : '');
    setWebsite(currentUser.profile?.website ? currentUser.profile.website : '');
    // if (currentUser && currentUser.profile && currentUser.profile.placeId) {
    //   geocodeByPlaceId(currentUser.profile.placeId).then((results) =>
    //     setLocation({
    //       placeId: currentUser.profile.placeId,
    //       description: results[0].formatted_address
    //     })
    //   );
    // }
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

  const resizeFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          let width = 200;
          let height = 200;

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image onto canvas
          context.drawImage(image, 0, 0, width, height);

          // Convert canvas content back to Blob
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: file.type });
            setAvatar(resizedFile)
            resolve(resizedFile);
          }, file.type);
        };

        image.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    });
  };


  const uploadFile = (file) => {
    // Perform the file upload to the server here
    // var sizeInMB = (file.size / (1024 * 1024));
    // console.log(sizeInMB + 'MB');

    const data = new FormData();
    data.append('file', file);
    dispatch(uploadAvatar(data, init));
  };

  const handleFileChange = ({ target }) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(target.files[0]);

    fileReader.onload = (e) => {
      resizeFile(target.files[0])
        .then((resizedFile) => {
          // Upload the resized file to the server
          uploadFile(resizedFile);
        })
        .catch((error) => {
          console.error('Error resizing file:', error);
        });
    };
  };

  const handleSaveProfileClick = async () => {
    var placeId = location.placeId;
    if (location.placeId) {
      try {
        await geocodeByPlaceId(placeId)
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) => {
            dispatch(
              saveProfile({ firstName, lastName, job, placeId, description, phoneNumber, zipCode, website, lat, lng }, () => {
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

                navigate('/listing/people', { replace: true })
              })
            );
          });
      } catch (err) {
        dispatch(
          saveProfile({ firstName, lastName, job, placeId, description, phoneNumber, zipCode, website, lat, lng }, () => {
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
      }
    }
    else {
      handleClickOpen()
    }
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
                    Trusted By
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="center" variant="h3">
                    {currentUser?.followings?.length}
                  </Typography>
                  <Typography align="center" variant="subtitle2">
                    Trust Given
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
            <Grid item xs={12} md={6}>
              <TextField
                name="zipCode"
                fullWidth
                label="Zip Code"
                value={zipCode}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setZipCode(e.target.value)}
                error={Boolean(errors?.zipCode)}
                helperText={errors?.zipCode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phoneNumber"
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={Boolean(errors?.phoneNumber)}
                helperText={errors?.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="website"
                fullWidth
                label="Website"
                value={website}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setWebsite(e.target.value)}
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
                          error={Boolean(errors?.placeId)}
                          helperText={errors?.placeId}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please Allow location service"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Let "Villages.io" determine your location to find people near you and display your post to nearby people.
          </Typography>
          <Typography gutterBottom>
            Open Setting and allow Location permission to "Villages.io"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Profile;
