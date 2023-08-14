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
  DialogActions,
  Paper
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

// ==============================|| Layouts ||============================== //
function PaymentDialog({ open, setOpen, recipientId, setCount }) {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);
  const { user, init } = useAuth();

  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [maxLimit, setMaxLimit] = useState(null);
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');

  const [paylogs, setPaylogs] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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


  return (
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
                  value={recipient?.length ? users.find((user) => user._id === recipient) : null}
                  onChange={(event, newValue) => {
                    setRecipient(newValue?._id);
                  }}
                  renderInput={(params) => (
                    < TextField
                      {...params}
                      label="CHOOSE THE PAYMENT RECEIVER:"
                      margin="normal"
                      size={'small'}
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
                    onChange={(e) => setAmount(Number(e.target.value))}
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
              disabled={maxLimit > 0 ? (isSubmitting ? true : false) : true}
            >
              Send Payment
            </Button>
            {maxLimit > 0 && (
              <Button variant="contained" color="primary" onClick={() => setShowGraph(!showGraph)} sx={{ ml: 1 }}>
                Show Graph
              </Button>
            )}
            <Button autoFocus onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default PaymentDialog;
