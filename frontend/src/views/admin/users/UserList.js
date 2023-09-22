import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AvatarGroup, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Chip, Dialog, DialogTitle, DialogActions } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import UserListSkeleton from 'ui-component/cards/Skeleton/UserList';

import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import DefaultAvatar from '../../../assets/images/auth/default.png';
import { SERVER_URL } from 'config';
import { dispatch } from 'store';
import { userActivate, deletUser, userVerification } from 'store/slices/user';
import { openSnackbar } from 'store/slices/snackbar';
import { geocodeByPlaceId } from 'react-places-autocomplete';

// ==============================|| USER LIST 2 ||============================== //

const UserList = ({ users, loading }) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null)
  const [location, setLocation] = useState({});
  useEffect(() => {
    async function fetchData() {
      var prelocation = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i]?.profile?.placeId) {
          try {
            const results = await geocodeByPlaceId(users[i].profile.placeId);
            prelocation.push(results[0].formatted_address);
          } catch {
            prelocation.push('No Description');
          }
        } else {
          prelocation.push('No Description');
        }
      }
      setLocation(prelocation);
      //   console.log(location);
    }
    fetchData();
  }, [users]);

  const handleUserActivate = (index) => {
    dispatch(userActivate(users[index], successAction));
  };
  const handleUserVerification = (id) => {
    dispatch(userVerification(id, successAction));
  };

  const handleUserDelete = (index) => {
    // successAction()
    dispatch(deletUser(users[index],
      () => {
        successAction()
        setDeleteID(null)
        setIsModalOpen(false)
      }
    ));
  };

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have edited user data successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  return (
    <>
      <TableContainer sx={{ overflowX: "initial" }}>
        <Table
          sx={{
            '& td': {
              whiteSpace: 'nowrap'
            },
            '& td:first-of-type': {
              pl: 0
            },
            '& td:last-of-type': {
              pr: 0,
              minWidth: 260
            },
            '& tbody tr:last-of-type  td': {
              borderBottom: 'none'
            },
            [theme.breakpoints.down('xl')]: {
              '& tr:not(:last-of-type)': {
                borderBottom: '1px solid',
                borderBottomColor: theme.palette.mode === 'dark' ? 'rgb(132, 146, 196, .2)' : 'rgba(224, 224, 224, 1)'
              },
              '& td': {
                display: 'inline-block',
                borderBottom: 'none',
                pl: 0
              },
              '& td:first-of-type': {
                display: 'block'
              }
            }
          }}
        >
          <TableBody>
            {loading ? (
              <>
                <UserListSkeleton />
                <UserListSkeleton />
                <UserListSkeleton />
              </>
            ) : (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar
                          alt={user?.username}
                          src={user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user.profile.avatar : DefaultAvatar}
                          sx={{ width: 70, height: 70 }}
                          component={Link}
                          // to={`/listing/person/${user?._id}/${user?.username}`}
                          to={`/${user.username}`}
                        />
                      </Grid>
                      <Grid item sm lg={8}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              align="left"
                              variant="subtitle1"
                              component={Link}
                              // to={`/listing/person/${user._id}/${user.username}`}
                              to={`/${user.username}`}
                              style={{ textDecoration: 'none' }}
                            >
                              {user?.username +
                                (user?.profile?.name
                                  ? ' ( ' + user.profile.name + ' ) '
                                  : ' ( ' + user?.firstName + ' ' + user?.lastName + ' )')}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                              {user?.profile?.job ? (
                                user.profile.job.length > 50 ? (
                                  user.profile.job.slice(0, 50) + '...'
                                ) : (
                                  user.profile.job
                                )
                              ) : (
                                <Chip label="No Description" size="small" />
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                              {user?.account?.balance}
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
                          {user?.profile?.description ? (
                            user.profile.description.length > 100 ? (
                              user.profile.description.slice(0, 100) + '...'
                            ) : (
                              user.profile.description
                            )
                          ) : (
                            <Chip label="No Description" size="small" />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">Email</Typography>
                        <Typography variant="h6">{user?.email}</Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="caption">Joined at</Typography>
                        <Typography variant="h6">{moment(user?.createdAt).format('YYYY-MM-DD')}</Typography>
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
                        <Typography variant="h6">
                          {user?.profile?.placeId ? <Chip label={location[index]} sx={{
                            '.MuiChip-label': {
                              whiteSpace: 'break-spaces',
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              "-webkit-line-clamp": "1",
                              "-webkit-box-orient": "vertical"
                            }
                          }} /> : <Chip label="No location" />}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid item xs={12} container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption">Trusted From</Typography>
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
                            {user.followers.map((each, index) => (
                              <Avatar
                                alt={each.username}
                                src={each.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + each.profile?.avatar : DefaultAvatar}
                                tooltip={each.username}
                                key={index}
                              />
                            ))}
                            {user.followers.length === 0 && <Chip label="No followers" />}
                          </AvatarGroup>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption">Trusted To</Typography>
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
                            {user.followings.map((each, index) => (
                              <Avatar
                                alt={each.username}
                                src={each.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + each.profile?.avatar : DefaultAvatar}
                                tooltip={each.username}
                                key={index}
                              />
                            ))}
                            {user.followings.length === 0 && <Chip label="No followings" />}
                          </AvatarGroup>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} container spacing={1}>
                      {
                        !!!user?.verified && <Grid item xs={4}>
                          <Button
                            variant="outlined"
                            color='error'
                            fullWidth
                            size="small"
                            sx={{ marginTop: 2 }}
                            onClick={() => {
                              handleUserVerification(user._id);
                            }}
                          >
                            Verify
                          </Button>
                        </Grid>
                      }
                      <Grid item xs={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginTop: 2 }}
                          component={Link}
                          to={`/admin/user/${user._id}`}
                        >
                          Detail
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginTop: 2 }}
                          onClick={() => {
                            handleUserActivate(index);
                          }}
                        >
                          {user.isActive ? 'Active' : 'NoActive'}
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginTop: 2 }}
                          onClick={() => {
                            setIsModalOpen(true)
                            setDeleteID(index)
                          }}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure want to delete this user?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            setIsModalOpen(false)
          }}>
            Cancel
          </Button>
          <Button variant='contained' onClick={() => {
            handleUserDelete(deleteID)
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
