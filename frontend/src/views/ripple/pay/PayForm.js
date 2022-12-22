import React, {useEffect, useState} from "react";

// material-ui
import {
  Grid,
  TextField,
  Divider,
  InputAdornment,
  Autocomplete,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import Help from '@mui/icons-material/Help';

import {useDispatch, useSelector} from "store";
import {getUsers, getMaxLimit, pay} from "store/slices/payment";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';
import {openSnackbar} from "../../../store/slices/snackbar";
import {searchEndorsements} from "../../../store/slices/endorsement";

// ==============================|| Layouts ||============================== //
function PayForm({ recipientId }) {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);

  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [maxLimit, setMaxLimit] = useState(0);
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({});

  const submitPayment = () => {
    dispatch(pay({recipient, amount, memo}, successAction))
  }

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: "You sent successfully",
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    )
    setRecipient('');
    setAmount(0);
    setMemo('');
  }

  useEffect(() => {
    setUsers(paymentState.users);
    setMaxLimit(paymentState.maxLimit);
    setErrors(paymentState.errors)
  }, [paymentState]);

  useEffect(() => {
    if(!!recipient) {
      dispatch(getMaxLimit(recipient))
    }
  }, [recipient])

  useEffect(() => {
    setRecipient(recipientId);
  }, [recipientId])

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const defaultProps = {
    options: users,
    getOptionLabel: (option) => `${option.username} (${option.email})`,
    filterOptions: (options, { inputValue }) => options.filter(item => item.username.includes(inputValue) || item.email.includes(inputValue))
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Payment">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel>Recipient</InputLabel>
              <Autocomplete
                {...defaultProps}
                id="recipient"
                value={users.find(user => user.id === recipient) || null}
                onChange={(event, newValue) => {
                  setRecipient(newValue.id);
                }}
                renderInput={(params) => <TextField {...params} label="CHOOSE THE PAYMENT RECEIVER:" margin="normal" size={'small'} error={errors.recipient} helperText={errors?.recipient || maxLimit > 0 ? `You can send up to ${maxLimit}VH` : 'You cannot send any value.'} />}
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
                  onChange={e => setAmount(e.target.value)}
                  error={errors.amount}
                  helperText={errors?.amount}
                  InputProps={{ endAdornment: <InputAdornment position="start">V.H.</InputAdornment> }}
                />
                <MuiTooltip placement="right" title={'Villages Hours are equal to a sustainable wage for a unskilled labor and the value varies depending on where you live'}>
                  <Help color={'secondary'}/>
                </MuiTooltip>
              </div>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>MEMO</InputLabel>
              <TextField
                id="memo"
                fullWidth
                multiline
                value={memo}
                onChange={e => setMemo(e.target.value)}
                rows={3}
              />
            </Grid>
          </Grid>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={submitPayment}>
                  Send Payment
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default PayForm;
