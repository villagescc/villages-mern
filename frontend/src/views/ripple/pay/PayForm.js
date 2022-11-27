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
import {getUsers} from "store/slices/payment";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';


// ==============================|| Layouts ||============================== //
function PayForm({ recipientId }) {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUsers(paymentState.users);
  }, [paymentState]);

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
                value={users.find(user => user.id === recipientId) || null}
                renderInput={(params) => <TextField {...params} label="CHOOSE THE TRUST RECEIVER:" margin="normal" size={'small'} error={errors.recipient} helperText={errors?.recipient} />}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Amount</InputLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  size={'small'}
                  id="amount"
                  type="number"
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
                rows={3}
              />
            </Grid>
          </Grid>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="contained" color="secondary">
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
