import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AvatarGroup, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Chip } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import UserListSkeleton from 'ui-component/cards/Skeleton/UserList';
import { SERVER_URL } from 'config';

import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import DefaultAvatar from '../../assets/images/auth/default.png';
import { geocodeByPlaceId } from 'react-places-autocomplete';

const UserListCard = (user, index) => {
  const theme = useTheme();
  const [location, setLocation] = useState('');
  useEffect(() => {
    if (user && user.user && user.user.profile && user.user.profile.placeId) {
      console.log(user.user.profile.placeId);
      geocodeByPlaceId(user?.user?.profile?.placeId).then((results) => {
        console.log(results[0].formatted_address);
        setLocation(results[0].formatted_address);
      });
    }
  }, [user]);
  console.log(user);
  return (
    <TableRow key={index}>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar
              alt={user?.user?.username}
              src={user.user.profile.avatar ? `${SERVER_URL}/upload/avatar/` + user.user.profile.avatar : DefaultAvatar}
              sx={{ width: 70, height: 70 }}
              component={Link}
              to={`/listing/person/${user.user._id}`}
            />
          </Grid>
          <Grid item sm lg={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  component={Link}
                  to={`/listing/person/${user._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  {user?.user?.firstName} {user?.user?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                  {user?.user?.profile?.job ? (
                    user.user.profile.job.length > 50 ? (
                      user.user.profile.job.slice(0, 50) + '...'
                    ) : (
                      user.user.profile.job
                    )
                  ) : (
                    <Chip label="No Description" size="small" />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                  {user?.user?.account?.balance}
                  {' V.H.'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption">User Job</Typography>
            {/* <Typography variant="h6">{user.email}</Typography> */}
            <Typography align="left" variant="h6" sx={{ whiteSpace: 'break-spaces' }}>
              {user?.user?.profile?.description ? (
                user.user.profile.description.length > 100 ? (
                  user.user.profile.description.slice(0, 100) + '...'
                ) : (
                  user.user.profile.description
                )
              ) : (
                <Chip label="No Description" size="small" />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">Username</Typography>
            <Typography variant="h6">{user?.user?.username}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="caption">Joined at</Typography>
            <Typography variant="h6">{moment(user?.user.createdAt).format('YYYY-MM-DD')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">Location</Typography>
            {/* <Typography variant="caption" sx={{ marginLeft: 1 }}>
                            {user?.profile?.placeId ? (
                              <Chip label={location} />
                            ) : (
                              // post?.userId?.profile?.placeId
                              <Chip label="No location" />
                            )}
                          </Typography> */}
            <Typography variant="h6">{user?.user?.profile?.placeId ? <Chip label={location} /> : <Chip label="No location" />}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid item xs={12} container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption">Trusted By</Typography>
            <Grid container>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '1rem'
                  }
                }}
              >
                {user?.user?.followers?.map((each, index) => (
                  <Avatar
                    alt={each.username}
                    src={each.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + each.profile?.avatar : DefaultAvatar}
                    tooltip={each.username}
                    key={index}
                  />
                ))}
                {user?.user?.followers?.length === 0 && <Chip label="No followers" />}
              </AvatarGroup>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Trust Given</Typography>
            <Grid container>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '1rem'
                  }
                }}
              >
                {user?.user?.followings?.map((each, index) => (
                  <Avatar
                    alt={each.username}
                    src={each.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + each.profile?.avatar : DefaultAvatar}
                    tooltip={each.username}
                    key={index}
                  />
                ))}
                {user?.user?.followings?.length === 0 && <Chip label="No followings" />}
              </AvatarGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1}>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              color="error"
              sx={{ minWidth: '33%', marginTop: 1 }}
              startIcon={<FavoriteIcon />}
              component={Link}
              to={`/ripple/trust/${user?.user?._id}`}
            >
              Trust
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              sx={{ minWidth: '33%', marginTop: 1 }}
              startIcon={<CurrencyExchangeIcon />}
              component={Link}
              to={`/ripple/pay/${user?.user?._id}`}
            >
              Pay
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              size="small"
              sx={{ minWidth: '33%', marginTop: 1 }}
              startIcon={<ChatIcon sx={{ marginLeft: `-1px`, marginRight: `-2px` }} />}
              component={Link}
              to={`/personal/message/${user._id}`}
            >
              Message
            </Button>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default UserListCard;
