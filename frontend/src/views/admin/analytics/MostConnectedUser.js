import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Grid, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { getMostConnectedUsers } from 'store/slices/user';
import { useDispatch, useSelector } from 'store';
import Empty from 'ui-component/Empty';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DefaultAvatar from '../../../assets/images/auth/default.png';
import { SERVER_URL } from 'config';

const MostConnectedUsers = ({ period, location }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(false);
    // const [filterData, setFilterData] = React.useState({
    //     filterRadius: '',
    // });
    const [mostConnectedUsers, setMostConnectedUsers] = useState([])
    const userState = useSelector((state) => state.user);

    React.useEffect(() => {
        setMostConnectedUsers(userState.mostConnectedUsers)
    }, [userState.mostConnectedUsers]);

    React.useEffect(() => {
        setLoading(userState.isUsersLoading);
    }, [userState.isUsersLoading]);
    React.useEffect(() => {
        dispatch(getMostConnectedUsers(period, location));
    }, [period, location]);

    return (
        <>
            <Grid item xs={12} md={6}>
                <MainCard>
                    <Grid container alignItems={'center'} padding={'20px 0'}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h4">Most Connected Users</Typography>
                        </Grid>
                    </Grid>
                    <Grid>
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
                                    [theme.breakpoints.down(1256)]: {
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
                                            <TableRow>
                                                <TableCell>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="circular" width={40} height={40} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="circular" width={40} height={40} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="circular" width={40} height={40} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Skeleton variant="rounded" width={"100%"} />
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : mostConnectedUsers?.length ? mostConnectedUsers?.map((user, index) => {
                                        // console.log(user, 'userssssssss');
                                        return <React.Fragment key={user?._id}>
                                            <TableRow>
                                                <TableCell>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={3} md={3} sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            paddingLeft: "0 !important",
                                                            justifyContent: 'center',
                                                        }}>
                                                            <Avatar
                                                                alt={user?.username}
                                                                src={user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user?.profile?.avatar : DefaultAvatar}
                                                                sx={{ width: 40, height: 40 }}
                                                                component={Link}
                                                                to={`/${user?.username}`}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={3} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: "0 !important" }}>
                                                            <Typography
                                                                align="left"
                                                                variant="subtitle1"
                                                                component={Link}
                                                                to={`/${user?.username}`}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                {user?.username}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Typography variant="caption">Followers</Typography>
                                                            <Typography variant="h6">{user?.followers}</Typography>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Typography variant="caption">Followings</Typography>
                                                            <Typography variant="h6">{user?.followings}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    }) : <Empty />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </MainCard>
            </Grid>
        </>
    );
};

export default MostConnectedUsers;
