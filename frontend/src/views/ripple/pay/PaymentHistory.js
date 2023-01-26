import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
// material-ui

import {
    CardActions,
    Grid,
    Button,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    IconButton,
    Chip,
    Typography,
    Pagination,
    Tooltip,
    InputLabel,
    TextField,
    Select,
    MenuItem,
    OutlinedInput,
    InputAdornment,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// third party
import moment from 'moment';
import { SERVER_URL } from 'config';

import MainCard from 'ui-component/cards/MainCard';
import PaperComponent from 'ui-component/extended/PaperComponent';
// assets
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DefaultAvatar from 'assets/images/auth/default.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconSearch } from '@tabler/icons';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// redux
import { dispatch } from 'store';
import { getTransactions, getTransaction } from 'store/slices/payment';
import { useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import TransactionDescription from './TransactionDescription';
import TransactionDetail from './TransactionDetail';

// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const PaymentHistory = ({ title, handleCreateClick }) => {
    const successSX = { color: 'success.dark' };
    const errorSX = { color: 'error.main' };

    const { transactions, transaction, total } = useSelector((state) => state.payment);
    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('All'); // "Completed", "Pending", "Failed"
    const [keyword, setKeyword] = useState('');
    const [address, setAddress] = useState('');
    const [paymentType, setPaymentType] = useState('All'); // "Deposit", "Withdraw"
    const [period, setPeriod] = useState([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now())]);

    const [showFilter, setShowFilter] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    const handleDetailClick = (id) => {
        dispatch(getTransaction(id));
        setOpenDetail(true);
    };

    useEffect(() => {
        dispatch(
            getTransactions({
                page,
                keyword,
                status,
                address,
                paymentType,
                period
            })
        );
    }, []);

    useEffect(() => {
        dispatch(
            getTransactions({
                page,
                keyword,
                status,
                address,
                paymentType,
                period
            })
        );
    }, [page, status, keyword, paymentType, period]);

    return (
        <MainCard
            title={title}
            content={false}
            secondary={
                <Grid container justifyContent="space-between" alignItems={'center'} spacing={1}>
                    <Grid item>
                        <Tooltip title="Create new payment">
                            <Button variant={'contained'} size={'small'} color={'primary'} onClick={handleCreateClick}>
                                Create Payment
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            size={'small'}
                            color={'secondary'}
                            startIcon={showFilter ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            }
        >
            {showFilter && (
                <Grid container padding={2} spacing={2} alignItems="center">
                    <Grid item xs={12} lg={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} lg={4}>
                                <InputLabel horizontal sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    Payment Type :
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} lg={8}>
                                <Select
                                    id="paymentType"
                                    name="paymentType"
                                    fullWidth
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Withdraw">Withdraw</MenuItem>
                                    <MenuItem value="Deposit">Deposit</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} lg={4}>
                                <InputLabel horizontal sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    Duration :
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} lg={8}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'From', end: 'To' }}>
                                    <DateRangePicker
                                        value={period}
                                        onChange={(newValue) => {
                                            setPeriod(newValue);
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField {...endProps} />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} lg={4}>
                                <InputLabel horizontal sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    Status :
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} lg={8}>
                                <Select
                                    id="status"
                                    name="status"
                                    fullWidth
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Failed">Failed</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} lg={4}>
                                <InputLabel horizontal sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    Keyword :
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} lg={8}>
                                <OutlinedInput
                                    id="input-search-card-style1"
                                    placeholder="Search Keyword"
                                    fullWidth
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconSearch stroke={1.5} size="16px" />
                                        </InputAdornment>
                                    }
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            setKeyword(event.target.value);
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>To/From</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center" sx={{ pr: 3 }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell>
                                    {row?.payer?._id === user?._id ? (
                                        <Avatar
                                            src={
                                                row?.recipient?.profile?.avatar
                                                    ? `${SERVER_URL}/upload/avatar/` + row?.recipient?.profile?.avatar
                                                    : DefaultAvatar
                                            }
                                        />
                                    ) : (
                                        <Avatar
                                            src={
                                                row?.payer?.profile?.avatar
                                                    ? `${SERVER_URL}/upload/avatar/` + row?.payer?.profile?.avatar
                                                    : DefaultAvatar
                                            }
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body1"
                                        component={Link}
                                        to={`/listing/person/${row?.payer?._id === user?._id ? row.recipient._id : row.payer._id}`}
                                    >
                                        {row?.payer?._id === user?._id ? row.recipient.username : row.payer.username}
                                    </Typography>
                                </TableCell>
                                <TableCell>{row.memo.length > 50 ? row.memo.slice(0, 50) + '...' : row.memo}</TableCell>
                                <TableCell align="right">
                                    {row?.payer?._id === user?._id ? (
                                        <Typography sx={errorSX}>- {row.amount} V.H.</Typography>
                                    ) : (
                                        <Typography sx={successSX}>+ {row.amount} V.H.</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">{moment(row.createdAt).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
                                <TableCell align="center">
                                    <Chip chipcolor={row.status} label={row.status} size="small" />
                                </TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <IconButton color="primary" size="large" onClick={() => handleDetailClick(row._id)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="inherit" size="large">
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Pagination
                    count={Math.ceil(total / 10)}
                    page={page}
                    onChange={(e, p) => {
                        setPage(p);
                    }}
                    color="secondary"
                />
            </CardActions>
            <Dialog
                fullWidth
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                scroll={'body'}
                aria-labelledby="draggable-dialog-title"
                PaperComponent={PaperComponent}
                maxWidth="md"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Payment Description
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <TransactionDetail transaction={transaction} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" autoFocus onClick={() => setOpenDetail(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

PaymentHistory.propTypes = {
    title: PropTypes.string
};

export default PaymentHistory;
