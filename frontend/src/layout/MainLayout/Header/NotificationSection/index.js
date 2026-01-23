import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons';
import { SERVER_URL } from "config";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'store';
import { getNotifications, setReadAll } from 'store/slices/notification';
import { openSnackbar } from "store/slices/snackbar";

// notification status options
const types = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'TRUST',
    label: 'Trust'
  },
  {
    value: 'PAYMENT',
    label: 'Payment'
  },
  {
    value: 'unread',
    label: 'Unread'
  }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('all');

  const notificationState = useSelector((state) => state.notification);

  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    dispatch(getNotifications());
    setSocket(io(SERVER_URL));
  }, [])

  useEffect(() => {
    setNotifications(notificationState.notifications)
  }, [notificationState])

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        dispatch(
          openSnackbar({
            open: true,
            message: notification.memo,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        )
        dispatch(getNotifications());
      })
    }
  }, [socket]);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => setType(event?.target.value);

  const handleReadAllClick = () => {
    dispatch(setReadAll(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'You have set all notifications as read.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      )
      dispatch(getNotifications());
    }))
  }

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge badgeContent={notifications.filter(item => item.status === 'NEW').length} color="secondary">
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [matchesXs ? 5 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">
                                {types.find(item => item.value == type)?.label}
                              </Typography>
                            </Stack>
                          </Grid>
                          {
                            notifications.filter(item => item.status === 'NEW').length > 0 && (
                              <Grid item>
                                <Typography onClick={handleReadAllClick} variant="subtitle2" color="primary" style={{ cursor: 'pointer' }}>
                                  Mark as all read
                                </Typography>
                              </Grid>
                            )
                          }
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PerfectScrollbar
                          style={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflowX: 'hidden'
                          }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ px: 2, pt: 0.25 }}>
                                <TextField
                                  id="outlined-select-currency-native"
                                  select
                                  fullWidth
                                  value={type}
                                  onChange={handleChange}
                                  SelectProps={{
                                    native: true
                                  }}
                                >
                                  {types.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </TextField>
                              </Box>
                            </Grid>
                            <Grid item xs={12} p={0}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          <NotificationList
                            notifications={
                              type === 'all'
                                ? notifications
                                : type === 'unread'
                                  ? notifications.filter(item => item.status === 'NEW')
                                  : notifications.filter(item => item.notificationType === type)
                            }
                          />
                        </PerfectScrollbar>
                      </Grid>
                    </Grid>
                    <Divider />
                    {
                      notifications.length > 0 && (
                        <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                          <Button component={Link} size="small" disableElevation to={'/personal/notification'} onClick={handleToggle}>
                            View All
                          </Button>
                        </CardActions>
                      )
                    }
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
