// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import ReactTimeAgo from 'react-time-ago'

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import DefaultUserIcon from 'assets/images/auth/default.png';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  minWidth: 300,
  padding: 16,
  '&:hover': {
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notifications }) => {
  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light,
    marginRight: '5px'
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
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {
        [...notifications].length > 0 ?
          [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification, key) => (
            <Grid key={key}>
              <ListItemWrapper>
                <ListItem alignItems="center" style={{ minWidth: 300 }}>
                  <ListItemAvatar>
                    <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={notification.status !== 'NEW'}>
                      <Avatar alt={notification.notifierId.username} src={notification.notifierId?.profile?.avatar ? notification.notifierId?.profile?.avatar : DefaultUserIcon} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={notification.notifierId.username} />
                  <ListItemSecondaryAction>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12}>
                        <Typography variant="caption" display="block" gutterBottom>
                          <ReactTimeAgo date={new Date(notification.createdAt)} locale="en-US"/>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                  <Grid item xs={12} sx={{ pb: 2 }}>
                    <Typography variant="subtitle2">
                      {notification?.memo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      {
                        notification.status === 'NEW' && (
                          <Grid item>
                            <Chip label="Unread" sx={chipErrorSX} />
                          </Grid>
                        )
                      }
                      <Grid item>
                        <Chip label={notification.notificationType} sx={notification.notificationType==='TRUST' ? chipSuccessSX : chipWarningSX} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItemWrapper>
              <Divider />
            </Grid>
          )) : (
            <ListItemWrapper>
              <Typography variant="subtitle2" align={'center'}>
                No notifications.
              </Typography>
            </ListItemWrapper>
          )
      }
    </List>
  );
};

export default NotificationList;
