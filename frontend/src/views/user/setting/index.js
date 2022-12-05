import * as React from "react";
import {useEffect, useRef, useState} from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button, CardActions,
  CardContent, Checkbox,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  Grid,
  InputAdornment, Pagination,
  TextField,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import FormControlSelect from "ui-component/extended/Form/FormControlSelect";

import {useDispatch, useSelector} from "store";
import InputLabel from "../../../ui-component/extended/Form/InputLabel";
import MuiTooltip from "@mui/material/Tooltip";
import Help from "@mui/icons-material/Help";
import {radius} from "../../../constant";
import {filterPost} from "../../../store/slices/posting";

// assets

// ==============================|| Setting ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [ errors, setErrors ] = useState({});
  const [ email, setEmail ] = useState('');
  const [ notificationCheck, setNotificationCheck ] = useState(false);
  const [ updateCheck, setUpdateCheck ] = useState(false);
  const [ language, setLanguage ] = useState('');
  const [ feedRadius, setFeedRadius ] = React.useState('');

  const defaultProps = {
    options: [],
    getOptionLabel: (option) => `${option}`,
    filterOptions: (options, { inputValue }) => options.filter(item => item.username.includes(inputValue) || item.email.includes(inputValue))
  };

  return (
      <MainCard
        title="Settings"
        content={false}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                size={'small'}
                value={email}
                InputLabelProps={{ shrink: true }}
                onChange={event => setEmail(event.target.value)}
                error={errors?.email}
                helperText={errors?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
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
                    checked={true}
                    name="checked"
                    color="primary"
                  />
                }
                label="RECEIVE UPDATES"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlSelect
                currencies={radius}
                currency={feedRadius}
                onChange={e => {
                  setFeedRadius(e.target.value)
                }}
                captionLabel="Feed around"
                error={errors?.feedRadius}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                {...defaultProps}
                id="language"
                value={language}
                renderInput={(params) => <TextField {...params} label="CHOOSE LANGUAGE:" margin="normal" size={'small'} error={errors.language} helperText={errors?.language} />}
              />
            </Grid>
          </Grid>
          <CardActions>
            <Button variant="contained" color="secondary">
              Save settings
            </Button>
          </CardActions>
        </CardContent>
      </MainCard>
  );
};

export default Index;
