import React, { useEffect, useState } from 'react';

// MUI
import { Button, Grid, Link, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// React Redux
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

// Moment
import moment from 'moment';

// Components
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Empty from 'ui-component/Empty';
import { approveDeveloper, getAllDeveloper } from 'store/slices/developer';
import { Stack } from '@mui/system';
import AnimateButton from 'ui-component/extended/AnimateButton';

const Developer = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.developer);

    const [developerApproval, setDeveloperApproval] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDeveloperApproval(state.developers);
    }, [state.developers]);

    useEffect(() => {
        setLoading(state.loading);
    }, [state.loading]);

    useEffect(() => {
        dispatch(getAllDeveloper());
    }, []);

    const isApproveDeveloper = (id) => {
        dispatch(approveDeveloper({ id, isApproved: true }));
    };

    return (
        <>
            <MainCard
                title={
                    <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
                        <Grid item xs={12} md={3} lg={6}>
                            <Typography variant="h3">Developer Approval</Typography>
                        </Grid>
                    </Grid>
                }
            >
                <TableContainer>
                    <Table sx={{ minWidth: 350 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>App Name</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Client Id</TableCell>
                                <TableCell>Redirect URL</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loading ? (
                                developerApproval?.map((row, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell>
                                            <Typography variant="body1" component={'span'}>
                                                {row?.applicationName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" component={'span'}>
                                                {row?.user?.username}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" component={'span'}>
                                                {row?.clientSecret}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`${row.redirectUrl}`} target="_blank">
                                                {row?.redirectUrl}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{moment(row.createdAt).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                                <AnimateButton>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="success"
                                                        disabled={row.isApproved}
                                                        onClick={() => isApproveDeveloper(row._id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                </AnimateButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                    {!loading && developerApproval?.length == 0 ? <Empty></Empty> : <></>}
                </TableContainer>
            </MainCard>
        </>
    );
};

export default Developer;
