import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

// material-ui
import { createTheme, useTheme } from '@mui/material/styles';
import { Autocomplete, Button, CardActions, CardContent, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';

import { useDispatch, useSelector } from 'store';
import { radius } from 'constant';
import { getSetting, saveSetting } from 'store/slices/user';
import { language } from 'constant';

import { openSnackbar } from 'store/slices/snackbar';
import useConfig from '../../../hooks/useConfig';

// assets

// ==============================|| Setting ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { onChangeLocale } = useConfig();

  const [errors, setErrors] = useState({});

  const setting = useSelector((state) => state.user.setting);

  const [data, setData] = useState({ email: '', notificationCheck: false, updateCheck: false, userCheck: false, feedRadius: 0, language: 'en' });

  useEffect(() => {
    dispatch(getSetting());
  }, []);

  useEffect(() => {
    setData({
      email: setting?.email ? setting.email : '',
      notificationCheck: setting?.receiveNotifications ? setting.receiveNotifications : true,
      updateCheck: setting?.receiveUpdates ? setting.receiveUpdates : true,
      userCheck: setting?.receiveUser ? setting.receiveUser : false,
      feedRadius: setting?.feedRadius ? setting.feedRadius : 0,
      language: setting?.language ? setting.language : 'en'
    });
  }, [setting]);

  const defaultProps = {
    options: [],
    getOptionLabel: (option) => `${option}`,
    filterOptions: (options, { inputValue }) =>
      options.filter((item) => item.username.includes(inputValue) || item.email.includes(inputValue))
  };

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have updated setting successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const onSaveSettings = () => {
    dispatch(saveSetting(data, successAction));
    onChangeLocale(data.language);
  };

  return (
    <MainCard title="Settings" content={false}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              size={'small'}
              value={data.email}
              InputLabelProps={{ shrink: true }}
              onChange={(event) => setData({ ...data, email: event.target.value })}
              error={errors?.email}
              helperText={errors?.email}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.notificationCheck}
                  onChange={() => setData({ ...data, notificationCheck: !data.notificationCheck })}
                  name="checked"
                  color="primary"
                />
              }
              label="RECEIVE NOTIFICATIONS"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.updateCheck}
                  onChange={() => setData({ ...data, updateCheck: !data.updateCheck })}
                  name="checked"
                  color="primary"
                />
              }
              label="RECEIVE UPDATES"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.userCheck}
                  onChange={() => setData({ ...data, userCheck: !data.userCheck })}
                  name="checked"
                  color="primary"
                />
              }
              label="RECEIVE USER SUGGESTIONS"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlSelect
              currencies={radius}
              currency={data.feedRadius}
              onChange={(e) => {
                setData({ ...data, feedRadius: e.target.value });
              }}
              captionLabel="Feed around"
              error={errors?.feedRadius}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlSelect
              currencies={language}
              currency={data.language}
              onChange={(e) => {
                setData({ ...data, language: e.target.value });
              }}
              captionLabel="Choose Language"
              error={errors?.language}
            />
          </Grid>
        </Grid>
        <CardActions>
          <Button variant="contained" color="secondary" onClick={onSaveSettings}>
            Save settings
          </Button>
        </CardActions>
      </CardContent>
    </MainCard>
  );
};

export default Index;
