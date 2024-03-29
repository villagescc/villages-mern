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
    // setZipCode(currentUser.profile?.zipCode ? currentUser.profile.zipCode : '');
    setPhoneNumber(currentUser.profile?.phoneNumber ? currentUser.profile.phoneNumber : '');
    setWebsite(currentUser.profile?.website ? currentUser.profile.website : '');
    if (currentUser && currentUser.profile && currentUser.profile.placeId) {
      geocodeByPlaceId(currentUser.profile.placeId).then((results) =>
        setLocation({
          placeId: currentUser.profile.placeId,
          description: results[0]?.formatted_address
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    compressFile(file)
      .then((compressedFile) => {
        // Upload the compressed file to the server
        uploadFile(compressedFile);
      })
      .catch((error) => {
        console.error('Error compressing file:', error);
      });
  };

  const compressFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          // Set canvas dimensions to match the image size
          canvas.width = image.width;
          canvas.height = image.height;

          // Draw the image on the canvas
          context.drawImage(image, 0, 0);

          // Convert the canvas content back to a data URL
          const compressedDataUrl = canvas.toDataURL(file.type, 0.1); // Adjust the quality as needed

          // Convert the data URL to a Blob object
          const compressedBlob = dataURLtoBlob(compressedDataUrl);

          // Create a new File object with the compressed Blob
          const compressedFile = new File([compressedBlob], file.name, { type: file.type });

          resolve(compressedFile);
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

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: contentType });
  };

  const uploadFile = (file) => {
    // Perform the file upload to the server here
    // var sizeInMB = (file.size / (1024 * 1024));
    // console.log(sizeInMB + 'MB');

    setAvatar(file)
    const formData = new FormData();
    formData.append('file', file);
    dispatch(uploadAvatar(formData, init));
  };

  const handleSaveProfileClick = async () => {
    var placeId = location.placeId;
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
                <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'center'} flexWrap={'wrap'} gap={1}>
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
                  <Button
                    variant={'outlined'}
                    size="small"
                    onClick={() => navigate(`/${user.username}`)}
                    sx={{ marginLeft: 1 }}
                  >
                    View Profile
                  </Button>
                </Grid>
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
            <Grid item xs={12} md={6}>
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
            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}
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
                onChange={(address) => {
                  setLocation({ description: address, placeId: '' })
                }}
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
                      onInputChange={(event, newInputValue) => {
                        !!!newInputValue?.length && setLocation({ description: '', placeId: '' })
                      }}
                      getOptionLabel={(option) => option.description || ''}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          onClick={() => {
                            setLocation(option);
                            document.activeElement.blur()
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
                          label='Location'
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
                placeholder={'Bio'}
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
