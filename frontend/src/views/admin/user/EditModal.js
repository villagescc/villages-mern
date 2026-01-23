import React, { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Box,
  Grid,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';

const EditModal = ({ open, onClose, onSave, user, tempData, setTempData }) => {
  const theme = useTheme();
  const [location, setLocation] = React.useState({});

  useEffect(() => {
    if (user && user.profile && user.profile.placeId) {
      geocodeByPlaceId(user.profile.placeId).then((results) =>
        setLocation({
          placeId: user.profile.placeId,
          description: results[0].formatted_address
        })
      );
    }
    setTempData({
      userId: user?._id,
      email: user?.email,
      username: user?.username,
      placeId: user?.profile?.placeId,
      job: user?.profile?.job,
      description: user?.profile?.description
    });
  }, [user]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      {open && (
        <>
          <DialogTitle id="form-dialog-title">Edit {user.firstName == '' ? 'Someone' : user.firstName}'s data</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <DialogContentText>
                <Typography variant="body2" component="span">
                  Let your friends know that you trust a promise from them and they can use their credit with your network.
                </Typography>
              </DialogContentText>
              {/* TODO: A component is changing an uncontrolled Autocomplete to be controlled */}
              {/* <Autocomplete
                                {...defaultProps}
                                id="recipient"
                                value={users.find((user) => user.id === endorsement.recipient) || null}
                                onChange={(event, newValue) => {
                                    setEndorsement({ ...endorsement, recipient: newValue.id });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="CHOOSE THE TRUST RECEIVER:"
                                        margin="normal"
                                        size={'small'}
                                        error={errors.recipient}
                                        helperText={errors?.recipient}
                                    />
                                )}
                            /> */}
              {/* <TextField
                                label="CREDIT LIMIT:"
                                size={'small'}
                                id="weight"
                                type="number"
                                InputProps={{ endAdornment: <InputAdornment position="start">V.H.</InputAdornment> }}
                                onChange={(event) => {
                                    setEndorsement({ ...endorsement, weight: event.target.value });
                                }}
                                value={endorsement?.weight}
                                error={errors.weight}
                                helperText={errors?.weight}
                            /> */}
              <TextField
                id="memo"
                fullWidth
                multiline
                rows={1}
                label="email:"
                defaultValue={user?.email}
                onChange={(event) => {
                  setTempData({ ...tempData, email: event.target.value });
                }}
              />
              <TextField
                id="memo"
                fullWidth
                multiline
                rows={1}
                label="username:"
                defaultValue={user?.username}
                onChange={(event) => {
                  setTempData({ ...tempData, username: event.target.value });
                }}
              />
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
                              setTempData({ ...tempData, placeId: option.placeId });
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
              <TextField
                id="memo"
                fullWidth
                multiline
                rows={1}
                label="job:"
                defaultValue={user?.profile.job}
                onChange={(event) => {
                  setTempData({ ...tempData, job: event.target.value });
                }}
              />
              <TextField
                id="memo"
                fullWidth
                multiline
                rows={3}
                label="description:"
                defaultValue={user?.profile?.description}
                onChange={(event) => {
                  setTempData({ ...tempData, description: event.target.value });
                }}
              />
              {/* <FormControlLabel
                                value="end"
                                control={
                                    <Switch
                                        color="success"
                                        onChange={(e) => {
                                            setEndorsement({ ...endorsement, referred: e.target.checked });
                                        }}
                                    />
                                }
                                label="REFER THIS PERSON'S SERVICES TO FRIENDS?"
                                labelPlacement="end"
                            /> */}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pr: 2.5 }}>
            <Button sx={{ color: theme.palette.error.dark }} onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EditModal;
