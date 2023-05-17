import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTheme, styled } from '@mui/material/styles';

// material-ui
import {
  Badge,
  Button,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { SERVER_URL } from "config";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "store";
import { getNotifications, setReadAll, deleteAll } from "store/slices/notification";
// material-ui

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import { openSnackbar } from "store/slices/snackbar";
import ReactTimeAgo from "react-time-ago";
import DefaultUserIcon from "assets/images/auth/default.png";
import { openDialog } from "store/slices/dialog";
import Empty from "ui-component/Empty";

// assets

// ==============================|| NOTIFICATIONS ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const notificationState = useSelector((state) => state.notification);

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  const handleDeleteAllClick = () => {
    dispatch(
      openDialog({
        open: true,
        title: 'Confirm',
        message: `Are you sure to delete all notifications?`,
        okLabel: 'delete',
        onOkClick: () => {
          dispatch(deleteAll(() => {
            dispatch(
              openSnackbar({
                open: true,
                message: 'You deleted all notifications.',
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
      })
    )
  }

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

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light,
    height: 28
  };

  return (
    <MainCard title={'Notifications'} content={false}>
      <CardContent>
        {
          notifications.length > 0 ? (
            <Grid
              container
              spacing={gridSpacing}
              alignItems="center"
              sx={{
                position: 'relative',
                '&>*': {
                  position: 'relative',
                  zIndex: '5'
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: 150,
                  width: 2,
                  height: '100%',
                  background: '#ebebeb',
                  zIndex: '1'
                }
              }}
            >
              {
                [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification, key) => (
                  <Grid item xs={12} key={notification._id}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item sx={{ minWidth: 100 }}>
                            <Typography align="right" variant="caption">
                              <ReactTimeAgo date={new Date(notification.createdAt)} locale="en-US" />
                            </Typography>
                            <Grid item>
                              <Chip size={'small'} label={notification.notificationType} sx={notification.notificationType === 'TRUST' ? chipSuccessSX : chipWarningSX} />
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={notification.status !== 'NEW'}>
                              <Avatar size={'md'} alt={notification.notifierId?.username} src={notification.notifierId?.profile?.avatar ? notification.notifierId?.profile?.avatar : DefaultUserIcon} />
                            </Badge>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography component="div" align="left" variant="subtitle1">
                              {notification.notifierId?.username}
                            </Typography>
                            <Typography component="div" align="left" variant="subtitle2">
                              {notification?.memo}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
              }
            </Grid>
          ) : (
            <Grid>
              <Empty />
            </Grid>
          )
        }
      </CardContent>
      <Divider />
      {
        notifications.length > 0 && (
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="text" size="small" onClick={handleDeleteAllClick}>
              Delete all
            </Button>
            <Button variant="text" size="small" onClick={handleReadAllClick}>
              Mark as all read
            </Button>
          </CardActions>
        )
      }
    </MainCard>
  );
};

export default Index;
