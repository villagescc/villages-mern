import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AvatarGroup, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Chip } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import UserListSkeleton from 'ui-component/cards/Skeleton/UserList';

import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import DefaultAvatar from '../../../assets/images/auth/default.png';

// ==============================|| USER LIST 2 ||============================== //

const UserList = ({ users, loading }) => {
    const theme = useTheme();

    return (
        <TableContainer>
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
                                        <Grid item>
                                            <Avatar
                                                alt={user.username}
                                                src={user.avatar ? 'http://localhost:5000/upload/avatar/' + user.avatar : DefaultAvatar}
                                                sx={{ width: 60, height: 60 }}
                                                component={Link}
                                                to={`/listing/person/${user.id}`}
                                            />
                                        </Grid>
                                        <Grid item sm zeroMinWidth>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        align="left"
                                                        variant="subtitle1"
                                                        component={Link}
                                                        to={`/listing/person/${user.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {user?.firstName} {user?.lastName}
                                                    </Typography>
                                                    <Typography align="left" variant="subtitle2" sx={{ whiteSpace: 'break-spaces' }}>
                                                        {user?.profile?.job}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                                                        {user?.description}
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
                                            <Typography variant="caption">Email</Typography>
                                            <Typography variant="h6">{user.email}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption">Username</Typography>
                                            <Typography variant="h6">{user.username}</Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption">Joined at</Typography>
                                            <Typography variant="h6">{moment(user.createdAt).format('YYYY-MM-DD')}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption">Location</Typography>
                                            <Typography variant="h6">
                                                {user.location ? user.location : <Chip label="No location" />}
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
                                                            src={
                                                                each.profile?.avatar
                                                                    ? 'http://localhost:5000/upload/avatar/' + each.profile?.avatar
                                                                    : DefaultAvatar
                                                            }
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
                                                            src={
                                                                each.profile?.avatar
                                                                    ? 'http://localhost:5000/upload/avatar/' + each.profile?.avatar
                                                                    : DefaultAvatar
                                                            }
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
                                        <Grid item xs={4}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                color="error"
                                                sx={{ minWidth: '30%', marginTop: 1 }}
                                                startIcon={<FavoriteIcon />}
                                                component={Link}
                                                to={`/ripple/trust/${user.id}`}
                                            >
                                                Trust
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                sx={{ minWidth: '30%', marginTop: 1 }}
                                                startIcon={<CurrencyExchangeIcon />}
                                                component={Link}
                                                to={`/ripple/pay/${user.id}`}
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
                                                sx={{ minWidth: '30%', marginTop: 1 }}
                                                startIcon={<ChatIcon />}
                                            >
                                                Message
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
    );
};

export default UserList;
