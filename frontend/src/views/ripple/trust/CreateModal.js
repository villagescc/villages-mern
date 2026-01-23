import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  InputAdornment,
  Switch,
  FormControlLabel,
  IconButton,
  useMediaQuery
} from '@mui/material';
import QrReader from 'modern-react-qr-reader';
import { editEndrosement } from 'store/slices/endorsement';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const CreateModal = ({ open, onClose, onSave, endorsement, users, setEndorsement, errors, username, setUsername, loading }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery('(min-width:410px)');
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const defaultProps = {
    options: users,
    getOptionLabel: (option) => {
      return option.firstName || option.lastName
        ? `${option.firstName} ${option.lastName} (${option.username})`
        : option.profile?.name
          ? `${option?.profile?.name} (${option.username})`
          : `${option.username}`;
    },
    filterOptions: (options, { inputValue }) => {
      return options.filter((item) => {
        return item.username?.toLowerCase().includes(inputValue?.toLowerCase()) || `${item?.firstName} ${item?.lastName}`.toLowerCase().includes(inputValue?.toLowerCase());
      });
    }
  };

  const [recipient, setRecipient] = React.useState({});
  const [hasCam, setHasCam] = useState(false)
  useEffect(() => {
    if (username) {
      setRecipient(users.find((user) => user.username === username) || null);
    }
    else {
      setRecipient(users.find((user) => user._id === endorsement.recipient) || null);
    }
  }, [endorsement, users, username]);

  // get all users details
  const endorsementState = useSelector((state) => state.endorsement);

  useEffect(() => {
    async function name() {
      let bool = false
      let md = navigator.mediaDevices;
      if (!md || !md.enumerateDevices) bool = true
      // md.enumerateDevices().then(devices => {
      //   bool = true
      // }).catch(() => {
      //   bool = false
      // })
      try {
        const res = await md.enumerateDevices()
        bool = res.some(devices => devices.kind === 'videoinput')
      } catch (error) {
        bool = false
      }
      setHasCam(bool)
    }
    name()
  }, [])

  // console.log(matchDownSM, 'matchDownSM');

  // const hasCam = useMemo(async () => {
  //   let md = navigator.mediaDevices;
  //   if (!md || !md.enumerateDevices) return true
  //   // md.enumerateDevices().then(devices => {
  //   //   return true
  //   // }).catch(() => {
  //   //   return false
  //   // })

  // }, [])


  // const hasCam = detectWebcam()

  // detectWebcam(function (hasWebcam) {
  // console.log(hasCam, 'hasCam');
  // })

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        {open && (
          <>
            <DialogTitle id="form-dialog-title">TRUST</DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <DialogContentText>
                  <Typography variant="body2" component="span">
                    Let your friends know that you trust a promise from them and they can use their credit with your network.
                  </Typography>
                </DialogContentText>
                {/* TODO: A component is changing an uncontrolled Autocomplete to be controlled */}
                <Autocomplete
                  {...defaultProps}
                  id="recipient"
                  value={
                    // users.find(user => user.id === endorsement.recipient) || null
                    recipient
                  }

                  onChange={(event, newValue) => {
                    setUsername(null)
                    setRecipient(users.find((user) => user._id === newValue?._id) || null);
                    !!newValue?._id ? setEndorsement({ ...endorsement, recipient: newValue?._id }) : setEndorsement({ weight: '', recipient: '', text: '' })
                    // navigation(`/ripple/trust/${newValue._id}`);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="CHOOSE THE TRUST RECEIVER:"
                      margin="normal"
                      size={'small'}
                      sx={{
                        "& .MuiAutocomplete-hasPopupIcon": {
                          paddingRight: "9px !important"
                        },
                        "& .MuiAutocomplete-hasClearIcon": {
                          paddingRight: "9px !important"
                        },
                        "& .MuiAutocomplete-inputRoot": {
                          paddingRight: "9px !important"
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: hasCam ? "translate(14px, -9px) scale(0.75) !important" : "translate(14px, -9px) scale(0.75) !important"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& legend ": {
                            transform: hasCam ? "translate(14px, 13px) scale(1)" : "translate(14px, 9px) scale(1)"
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: hasCam ? <Button sx={{ p: matchDownSM ? "5px 10px" : "5px 0px", minWidth: !matchDownSM ? '40px' : "64px" }} variant='contained' aria-label="menu" onClick={(e) => {
                          e.stopPropagation()
                          setIsScannerOpen(true)
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 7v-1a2 2 0 0 1 2 -2h2"></path>
                            <path d="M4 17v1a2 2 0 0 0 2 2h2"></path>
                            <path d="M16 4h2a2 2 0 0 1 2 2v1"></path>
                            <path d="M16 20h2a2 2 0 0 0 2 -2v-1"></path>
                            <path d="M5 12l14 0"></path>
                          </svg>{matchDownSM ? " Scan" : ""}
                        </Button> : null
                      }}
                      InputLabelProps={{ style: { transform: hasCam ? "translate(14px, 13px) scale(1)" : "translate(14px, 9px) scale(1)" } }}
                      // InputProps={{ endAdornment: <p>Scan</p> }}
                      error={errors.recipient}
                      helperText={errors?.recipient}
                    />
                  )}
                />
                <TextField
                  label="CREDIT LIMIT:"
                  size={'small'}
                  id="weight"
                  type="number"
                  InputLabelProps={{ shrink: Boolean(String(endorsement?.weight)?.length) ? true : false }}
                  onKeyDown={(event) => {
                    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 189) {
                      event.preventDefault()
                    }
                  }}
                  InputProps={{ endAdornment: <InputAdornment position="start">V.H.</InputAdornment>, inputProps: { min: 0 } }}
                  onChange={(event) => {
                    setEndorsement({ ...endorsement, weight: event.target.value });
                    endorsementState?.endorsementData?.hasOwnProperty('weight') && dispatch(editEndrosement({ ...endorsementState?.endorsementData, weight: event.target.value }))
                  }}
                  value={String(endorsement?.weight)?.length ? endorsement?.weight : ''}
                  error={errors.weight}
                  helperText={errors?.weight}
                />
                <TextField
                  id="memo"
                  fullWidth
                  multiline
                  rows={3}
                  label="TESTIMONIAL:"
                  value={endorsement?.text ?? ''}
                  onChange={(event) => {
                    setEndorsement({ ...endorsement, text: event.target.value });
                  }}
                />
                <FormControlLabel
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
                />
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
      <Dialog
        fullWidth
        open={isScannerOpen}
        aria-labelledby="scanner-dialog-title"
        onClose={() => {
          setIsScannerOpen(false)
        }}
      >
        <DialogTitle id="scanner-dialog-title">Scan QR Code
          <IconButton
            aria-label="close"
            onClick={() => {
              setIsScannerOpen(false)
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* {console.log('calleddddddddddddd')} */}
        <DialogContent>
          <QrReader
            delay={1500}
            onError={(error) => {
              console.info(error);
            }}
            facingMode={"environment"}
            // constraints={{ facingMode: 'environment', }}
            onScan={(result) => {
              console.log(result, 'result');
              if (!!result) {
                const url = new URL(result)
                setRecipient(users.find((user) => user.username === url?.pathname?.split('/')?.[1]) || null);
                if (users.find((user) => user.username === url?.pathname?.split('/')?.[1])) {
                  setIsScannerOpen(false)
                  if (navigator.vibrate) {
                    navigator.vibrate(200)
                  }
                }
              }
            }}
            style={{ width: '100%', height: "100%" }}
          />
        </DialogContent>
      </Dialog >
    </>
  );
};

export default CreateModal;
