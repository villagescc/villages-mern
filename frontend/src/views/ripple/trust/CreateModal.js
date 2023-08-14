import React, { useEffect } from 'react';
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
  FormControlLabel
} from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { editEndrosement } from 'store/slices/endorsement';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';

const CreateModal = ({ open, onClose, onSave, endorsement, users, setEndorsement, errors }) => {
  const theme = useTheme();
  const navigation = useNavigate();
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
  useEffect(() => {
    setRecipient(users.find((user) => user._id === endorsement.recipient) || null);
  }, [endorsement, users]);

  // get all users details
  const endorsementState = useSelector((state) => state.endorsement);


  return (
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
  );
};

export default CreateModal;
