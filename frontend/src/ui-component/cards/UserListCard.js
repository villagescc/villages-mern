import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AvatarGroup, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Chip, Badge } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import UserListSkeleton from 'ui-component/cards/Skeleton/UserList';
import { SERVER_URL } from 'config';

import moment from 'moment';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import DefaultAvatar from '../../assets/images/auth/default.png';
import { geocodeByPlaceId } from 'react-places-autocomplete';



const UserListCard = (user, index) => {
  const theme = useTheme();
  const [location, setLocation] = useState('');
  useEffect(() => {
    async function fetchData() {
      if (user && user.user && user.user.profile && user.user.profile.placeId) {
        try {
          const results = await geocodeByPlaceId(user.user.profile.placeId);
          setLocation(results[0].formatted_address);
        } catch {
          setLocation('No Description');
        }
      } else setLocation('No Description');
    }
    fetchData();
  }, [user]);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      color: '#FF0000',
    },
  }));
  return (
    <TableRow key={index}>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
              user?.user?.followers?.length ? (<StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<FavoriteIcon />}
              >
                <Avatar
                  alt={user?.user?.username}
                  src={user.user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user.user?.profile?.avatar : DefaultAvatar}
                  sx={{ width: 70, height: 70 }}
                  component={Link}
                  // to={`/listing/person/${user.user._id}/${user.user.username}`}
                  to={`/${user.user.username}`}
                />
              </StyledBadge>) : (<Avatar
                alt={user?.user?.username}
                src={user.user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user.user?.profile?.avatar : DefaultAvatar}
                sx={{ width: 70, height: 70 }}
                component={Link}
                // to={`/listing/person/${user.user._id}/${user.user.username}`}
                to={`/${user.user.username}`}
              />)
            }
          </Grid>
          <Grid item sm lg={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography
                  align="left"
                  variant="subtitle1"
                  component={Link}
                  // to={`/listing/person/${user.user._id}/${user.user.username}`}
                  to={`/${user.user.username}`}
                  style={{ textDecoration: 'none' }}
                >
                  {user?.user?.username}
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
            <Typography variant="caption">Full Name</Typography>
            <Typography variant="h6">
              {user?.user?.profile?.name ? user.user.profile.name : user?.user?.firstName + ' ' + user?.user?.lastName}
            </Typography>
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
            <Typography variant="h6">{user?.user?.profile?.placeId ? <Chip label={location} sx={{
              '.MuiChip-label': {
                whiteSpace: 'break-spaces',
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                "-webkit-line-clamp": "1",
                "-webkit-box-orient": "vertical"
              }
            }} /> : <Chip label="No location" />}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid item xs={12} container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="caption">Recently active</Typography>
            <Typography variant="h6">{moment(user.user?.profile?.recentlyActive).format('YYYY-MM-DD')}</Typography>
          </Grid>
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
                    alt={each.profile?.user?.username}
                    src={each.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + each.profile?.avatar : DefaultAvatar}
                    tooltip={each.profile?.user?.username}
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
              to={`/trust/${user?.user?._id}/${user?.user?.username}`}
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
              startIcon={<AccountBalanceWalletOutlined />}
              component={Link}
              to={`/pay/${user?.user?._id}/${user?.user?.username}`}
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
              to={`/personal/message/${user?.user?._id}/${user?.user?.username}`}
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
