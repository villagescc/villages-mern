import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from '@mui/material';

// third party
import Draggable from 'react-draggable';
import {useDispatch, useSelector} from "../../store";
import { closeDialog, initDialog } from 'store/slices/dialog';

// draggable
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function DragDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);

  const handleClose = () => {
    dispatch(closeDialog());
    dispatch(initDialog());
  };

  const handleOkClick = () => {
    dialog.onOkClick()
    dispatch(closeDialog());
  };

  return (
    <div>
      <Dialog open={dialog.open} onClose={handleClose} PaperComponent={PaperComponent} fullWidth aria-labelledby="draggable-dialog-title">
        {dialog.open && (
          <>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {dialog.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography variant="body2" component="span">
                  {dialog.message}
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: theme.palette.error.dark }} autoFocus onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={handleOkClick}>
                {dialog.okLabel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
