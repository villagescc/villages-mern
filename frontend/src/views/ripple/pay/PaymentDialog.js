import React, { useEffect, useState } from 'react';

// material-ui
import {
  Grid,
  TextField,
  InputAdornment,
  Autocomplete,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Paper,
  useMediaQuery
} from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import Help from '@mui/icons-material/Help';

import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'store';
import { getUsers, pay, getMaxLimit, getTransactions } from 'store/slices/payment';
import { getPath } from 'store/slices/graph';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import Graph from '../graph/path';

import PaperComponent from 'ui-component/extended/PaperComponent';

import CloseIcon from '@mui/icons-material/Close';
import QrReader from 'modern-react-qr-reader';

// ==============================|| Layouts ||============================== //
function PaymentDialog({ open, setOpen, recipientId, setCount, amount, setAmount, memo, setMemo, username, setUsername }) {
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery('(min-width:410px)');
  const paymentState = useSelector((state) => state.payment);
  const { user, init } = useAuth();

  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [recipientValue, setRecipientValue] = useState(null)
  const [maxLimit, setMaxLimit] = useState(null);

  const [paylogs, setPaylogs] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [hasCam, setHasCam] = useState(false)
  const [notifyText, setNotifyText] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPayment = () => {
    setIsSubmitting(true);
    dispatch(pay({ recipient, amount, memo }, successAction, setIsSubmitting));
  };

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You sent successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
    setIsSubmitting(false);
    setRecipient('');
    setAmount(0);
    setMemo('');
    setOpen(false);
    init();
    setCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    let relatedUsers = [];
    let transactions = [...paymentState.transactions];
    for (const transaction of transactions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })) {
      let user = {
        _id: transaction.recipient?._id,
        username: transaction.recipient?.username,
        firstName: transaction.recipient?.firstName,
        lastName: transaction.recipient?.lastName,
        profile: transaction.recipient?.profile
      };
      if (!relatedUsers.find((userr) => userr._id === user._id)) {
        relatedUsers.push(user);
      }
    }

    for (const user of paymentState.users) {
      if (!relatedUsers.find((userr) => userr._id === user._id)) relatedUsers.push(user);
    }
    // setUsers(paymentState.users);
    setUsers(relatedUsers);
    setMaxLimit(paymentState.maxLimit);
    setPaylogs([...paymentState.paylogs]);
    setErrors(paymentState.errors);
    setLoading(paymentState.loading);
  }, [paymentState]);

  useEffect(() => {
    if (!!recipient) {
      setNotifyText(true);
      dispatch(getPath(user._id, recipient, setNotifyText));
      dispatch(getMaxLimit(recipient));
    } else {
      setNotifyText(false);
      setAmount(0);
      setMaxLimit(null)
    }
  }, [recipient]);

  useEffect(() => {
    setRecipient(recipientId);
  }, [recipientId]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if (open)
      setRecipientValue(null)
  }, [open])


  useEffect(() => {
    setRecipientValue(recipient ? users.find((user) => user._id == recipient) : null)
    // console.log(users.find(x => x.username == username)?._id, 'allUsers');
    if (users.length !== 0 && username) {
      setRecipient(users.find(x => x.username == username)?._id);
    }
  }, [users, username])



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

  // console.log(recipient, 'recipient');

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          setOpen(false)
          setRecipient('')
          setAmount(0);
          setErrors({})
        }}
        scroll={'body'}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
      >
        {open && (
          <>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Payment
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <InputLabel>Recipient</InputLabel>
                  <Autocomplete
                    {...defaultProps}
                    id="recipient"
                    disabled={loading}
                    value={recipientValue}
                    onChange={(event, newValue) => {
                      setUsername(null)
                      setRecipient(newValue?._id);
                      setRecipientValue(newValue?._id);
                    }}
                    renderInput={(params) => (
                      < TextField
                        {...params}
                        label="CHOOSE THE PAYMENT RECEIVER:"
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
                            </svg>{" "}{matchDownSM ? " Scan" : ""}
                          </Button> : null
                        }}
                        InputLabelProps={{ style: { transform: hasCam ? "translate(14px, 13px) scale(1)" : "translate(14px, 9px) scale(1)" } }}
                        error={errors?.recipient ? errors.recipient : false}
                        helperText={
                          notifyText
                            ? 'Please wait for a while getting path...'
                            : parseFloat(maxLimit) >= 0
                              ? `You can send up to ${maxLimit}VH`
                              : errors?.recipient
                                ? errors.recipient
                                : 'Please select the recipient'
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Amount</InputLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      size={'small'}
                      id="amount"
                      type="number"
                      value={amount}
                      onKeyDown={(event) => {
                        if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 189) {
                          event.preventDefault()
                        }
                      }}
                      onChange={(e) => setAmount((e.target.value))}
                      error={errors.amount}
                      helperText={errors?.amount}
                      InputProps={{ endAdornment: <InputAdornment position="start">V.H.</InputAdornment>, inputProps: { min: 0 } }}
                    />
                    <MuiTooltip
                      placement="right"
                      title={
                        'Villages Hours are equal to a sustainable wage for a unskilled labor and the value varies depending on where you live'
                      }
                    >
                      <Help color={'secondary'} />
                    </MuiTooltip>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>MEMO</InputLabel>
                  <TextField id="memo" fullWidth multiline value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} />
                </Grid>
              </Grid>
              <Dialog fullWidth maxWidth={'md'} open={showGraph} onClose={() => setShowGraph(false)} scroll={'body'}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Graph />
                  </Grid>
                </Grid>
              </Dialog>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={submitPayment}
                disabled={(maxLimit > 0 && amount) ? (isSubmitting ? true : false) : true}
              >
                Send Payment
              </Button>
              {(maxLimit > 0) && (
                <Button variant="contained" color="primary" onClick={() => setShowGraph(!showGraph)} sx={{ ml: 1 }}>
                  Show Graph
                </Button>
              )}
              <Button autoFocus onClick={() => {
                setOpen(false)
                setRecipient('')
                setAmount(0);
                setErrors({})
              }} color="secondary">
                Cancel
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
              // console.log(result, 'result');
              if (!!result) {
                const url = new URL(result)
                setRecipient(users.find((user) => user.username === url?.pathname?.split('/')?.[1])?._id || null);
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
}

export default PaymentDialog;
