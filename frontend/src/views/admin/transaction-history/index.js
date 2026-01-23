import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// import PropTypes from 'prop-types';
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
    // IconButton,
    Chip,
    Typography,
    Pagination,
    // Tooltip,
    // InputLabel,
    TextField,
    // Select,
    // MenuItem,
    // OutlinedInput,
    // InputAdornment,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    // useMediaQuery,
    Autocomplete,
    Skeleton,
    IconButton,
    InputLabel,
    InputAdornment
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Empty from 'ui-component/Empty';
// third party
import moment from 'moment';
// import { SERVER_URL } from 'config';

// import MainCard from 'ui-component/cards/MainCard';
import PaperComponent from 'ui-component/extended/PaperComponent';
// assets
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import DefaultAvatar from 'assets/images/auth/default.png';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import { IconSearch } from '@tabler/icons';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

// redux
// import { dispatch } from 'store';
// import {  getTransaction } from 'store/slices/payment';
import { useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import MainCard from 'ui-component/cards/MainCard';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import { gridSpacing } from 'store/constant';
import { getPaymentHistory } from 'store/slices/user';
import { LoadingButton } from '@mui/lab';
import { CSVLink } from "react-csv";
import MuiTooltip from '@mui/material/Tooltip';
import axios from 'utils/axios';
import Help from '@mui/icons-material/Help';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
// import TransactionDescription from './TransactionDescription';
// import TransactionDetail from './TransactionDetail';

// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const TransactionHistory = () => {
    // const screenSize = useMediaQuery('(min-width:600px)');
    const successSX = { color: 'success.dark' };
    const errorSX = { color: 'error.main' };
    const dispatch = useDispatch()
    const state = useSelector((state) => state.user);
    const { user } = useAuth();
    // const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1);
    // const [status, setStatus] = useState('All'); // "Completed", "Pending", "Failed"
    // const [keyword, setKeyword] = useState('');
    // const [address, setAddress] = useState('');
    // const [paymentType, setPaymentType] = useState('All'); // "Deposit", "Withdraw"
    const [period, setPeriod] = useState([null, null]);
    const [isCSVFileLoading, setIsCSVFileLoading] = useState(false)
    const [CSVData, setCSVData] = useState([])
    const csvLinkRef = useRef(null)
    const [deleteID, setDeleteID] = useState(null)
    const [errors, setErrors] = useState({});

    // const [amount, setAmount] = useState(false);
    const [editTransaction, setEditTransaction] = useState({ amount: 0, description: "", _id: null })
    const [transactionHistory, setTransactionHistory] = useState([])
    const [dateRange, setDateRange] = useState([null, null])
    const [location, setLocation] = useState({ description: '', placeId: '' });
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState({ description: "", placeId: "" })
    // const [showFilter, setShowFilter] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const handleDetailClick = (id) => {
    //     dispatch(getTransaction(id));
    //     setOpenDetail(true);
    // };

    // useEffect(() => {
    //     dispatch(
    //         getPaymentHistory({
    //             page,
    //             period
    //         })
    //     );
    // }, []);

    useEffect(() => {
        setTotal(state.transactionHistory.total)
        setTransactionHistory(state.transactionHistory.transactions)
    }, [state.transactionHistory])

    useEffect(() => {
        setLoading(state.loading)
    }, [state.loading])


    useEffect(() => {
        dispatch(getPaymentHistory(page, dateRange, selectedOptions));
    }, [page, period, selectedOptions]);

    let filename = 'Transaction_history'
    if (location.placeId !== '') {
        filename += `_${location.description}`;
    }

    // Check if fromdate filter is applied and add it to the filename
    if (dateRange[0]) {
        filename += `_${new Date(dateRange[0])?.toLocaleDateString()}`;
    }

    // Check if todate filter is applied and add it to the filename
    if (dateRange[1]) {
        filename += `_${new Date(dateRange[1])?.toLocaleDateString()}`;
    }

    return (
        <>
            <MainCard title={
                <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
                    <Grid item xs={12} lg={3}>
                        <Typography variant="h3">Transaction History</Typography>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3} alignSelf={'center'} textAlign={{ sm: 'start', lg: "end" }}>
                                <LoadingButton variant='contained' loading={isCSVFileLoading} disabled={loading} onClick={(event, done) => {
                                    setIsCSVFileLoading(true)
                                    axios.post('/admin/users/export/transactionHistory', { dateRange, viewport: selectedOptions }).then(res => {
                                        if (res.data.success) {
                                            setCSVData(res.data.transactions)
                                            setTimeout(() => {
                                                csvLinkRef.current.link.click()
                                            }, 500);
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                    }).finally(() => {
                                        setIsCSVFileLoading(false)
                                    })
                                }}>
                                    Export as CSV
                                </LoadingButton>
                                <CSVLink
                                    ref={csvLinkRef}
                                    filename={filename}
                                    // asyncOnClick={true}
                                    data={CSVData ?? []}
                                    style={{ listStyleType: "none" }}
                                >

                                </CSVLink>
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <PlacesAutocomplete
                                    value={location.description || ''}
                                    onChange={(address) => {
                                        setLocation({ description: address, placeId: '' })
                                    }}
                                >
                                    {({ getInputProps, suggestions }) => {
                                        return (
                                            <Autocomplete
                                                id="location"
                                                value={location}
                                                sx={{ width: '100%' }}
                                                options={suggestions.map((suggestion) => ({
                                                    description: suggestion.description,
                                                    placeId: suggestion.placeId
                                                }))}
                                                autoHighlight
                                                onInputChange={(event, newInputValue) => {
                                                    if (!!!newInputValue?.length) {
                                                        setSelectedOptions({ description: "", placeId: "" })
                                                        setLocation({ description: '', placeId: '' })
                                                    }
                                                }}
                                                getOptionLabel={(option) => option.description || ''}
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li"
                                                        {...props}
                                                        onClick={async () => {
                                                            setLocation(option);
                                                            // geocodeByPlaceId(option.placeId).then(res => {
                                                            //     getLatLng(res[0]).then((res2 => {
                                                            //         setSelectedOptions(res2)
                                                            //     })).catch((e) => { console.log(e) })
                                                            // }).catch(() => { })
                                                            try {
                                                                const res = await geocodeByPlaceId(option.placeId)
                                                                // const res2 = await getLatLng(res[0].geometry.viewport)
                                                                setSelectedOptions(res[0].geometry.viewport)
                                                            } catch (error) {

                                                            } finally {
                                                                document.activeElement.blur()
                                                            }
                                                        }}
                                                    >
                                                        {option.description}
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        {...getInputProps({
                                                            placeholder: 'Search Places ...',
                                                            className: 'location-search-input'
                                                        })}
                                                        label='Location'
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                </PlacesAutocomplete>
                            </Grid>
                            <Grid item xs={12} sm={5} >
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'From', end: 'To' }}>
                                    <DateRangePicker
                                        value={dateRange}
                                        onClose={() => {
                                            setPeriod(dateRange)
                                        }}
                                        onChange={(newValue) => {
                                            setDateRange(newValue);
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} sx={{ width: "100%" }} autoComplete='off' />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField {...endProps} sx={{ width: "100%" }} autoComplete='off' />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }>
                <TableContainer>
                    <Table sx={{ minWidth: 350 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>To</TableCell>
                                <TableCell>From</TableCell>
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
                            {!loading ? transactionHistory?.map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            component={Link}
                                            to={`/${row?.payer?._id === user?._id ? row?.recipient?.username : row?.payer?.username}`}
                                            style={{ textDecoration: 'none' }}
                                        >

                                            {/* {row?.payer?._id === user?._id ? row?.recipient?.profile?.name + '(' + row?.recipient?.username + ')' : row?.payer?.username} */}
                                            {row?.recipient?.profile?.name
                                                ? row?.recipient?.profile?.name + '(' + row?.recipient?.username + ')'
                                                : row?.recipient?.firstName || row?.recipient?.lastName
                                                    ? row?.recipient?.firstName + ' ' + row?.recipient?.lastName + '(' + row?.recipient?.username + ')'
                                                    : row?.recipient?.username}
                                        </Typography>


                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            component={Link}
                                            to={`/${row?.payer?._id === user?._id ? row?.recipient?.username : row?.payer?.username}`}
                                            style={{ textDecoration: 'none' }}
                                        >

                                            {/* {row?.payer?._id === user?._id ? row?.recipient?.profile?.name + '(' + row?.recipient?.username + ')' : row?.payer?.username} */}
                                            {row?.payer?.profile?.name
                                                ? row?.payer?.profile?.name + '(' + row?.payer?.username + ')'
                                                : row?.payer?.firstName || row?.payer?.lastName
                                                    ? row?.payer?.firstName + ' ' + row?.payer?.lastName + '(' + row?.payer?.username + ')'
                                                    : row?.payer?.username}
                                        </Typography>


                                    </TableCell>
                                    <TableCell>{row.memo ? row.memo.length > 50 ? row.memo.slice(0, 50) + '...' : row.memo : <Chip label="No description" />}</TableCell>
                                    <TableCell align="right">
                                        {/* {row?.payer?._id === user?._id ? (
                                            <Typography sx={errorSX}>- {row.amount} V.H.</Typography>
                                        ) : (
                                        )} */}
                                        <Typography>{row.amount} V.H.</Typography>
                                    </TableCell>
                                    <TableCell align="center">{moment(row.createdAt).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
                                    <TableCell align="center">
                                        <Chip chipcolor={row.status} label={row.status} size="small" />
                                    </TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center">
                                            <IconButton color="primary" size="large" onClick={() => {
                                                setEditTransaction({ amount: row?.amount ?? 0, description: row?.memo ?? "", _id: row?._id })
                                                setOpenDetail(true)
                                            }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="primary" size="large" onClick={() => {
                                                setIsModalOpen(true)
                                                setDeleteID(row?._id)
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : <>
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
                                    <TableCell>
                                        <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rounded" height={20} sx={{ marginBottom: 1 }} />
                                    </TableCell>
                                </TableRow>
                            </>}
                        </TableBody>
                    </Table>
                    {(!loading && transactionHistory?.length == 0 ? <Empty></Empty> : <></>)}
                </TableContainer>
                {(!loading && transactionHistory.length !== 0) && <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Pagination
                        count={Math.ceil(total / 10)}
                        page={page}
                        onChange={(e, p) => {
                            setPage(p);
                        }}
                        color="secondary"
                    />
                </CardActions>}
                <Dialog
                    fullWidth
                    open={openDetail}
                    onClose={() => setOpenDetail(false)}
                    scroll={'body'}
                    aria-labelledby="draggable-dialog-title"
                    PaperComponent={PaperComponent}
                    maxWidth="xs"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Edit Transaction
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <InputLabel>Amount</InputLabel>
                                <div style={{ display: 'flex', alignItems: 'center', gap: "15px" }}>
                                    <TextField
                                        fullWidth
                                        size={'small'}
                                        id="amount"
                                        type="number"
                                        sx={{ flex: 1 }}
                                        value={editTransaction.amount}
                                        onKeyDown={(event) => {
                                            if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 189) {
                                                event.preventDefault()
                                            }
                                        }}
                                        onChange={(e) => {
                                            setEditTransaction({ ...editTransaction, amount: Number(e.target.value) })
                                        }}
                                        error={errors.amount}
                                        helperText={errors?.amount}
                                        InputProps={{ endAdornment: <InputAdornment position="start">V.H.</InputAdornment>, inputProps: { min: 0 } }}
                                    />
                                    <MuiTooltip
                                        placement="right"
                                        title={
                                            'Villages Hours are equal to a sustainable wage for a unskilled labor and the value varies depending on where you live'
                                        }
                                    >
                                        <Help color={'secondary'} />
                                    </MuiTooltip>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Description</InputLabel>
                                {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
                                <TextField
                                    fullWidth
                                    size={'small'}
                                    id="description"
                                    type="text"
                                    value={editTransaction.description}
                                    onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                                    error={errors.description}
                                    helperText={errors?.description}
                                />
                                {/* </div> */}
                                {/* <TransactionDetail transaction={transaction} /> */}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" autoFocus onClick={() => {
                            axios.post('/admin/users/edit/transactionHistory', { ...editTransaction }).then(res => {
                                if (res.data.success) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: res.data.message,
                                            variant: 'alert',
                                            alert: {
                                                color: 'success',
                                                severity: 'success'
                                            },
                                            close: false
                                        })
                                    );
                                    dispatch(getPaymentHistory(page, dateRange, selectedOptions))
                                }
                            }).catch(err => {
                                console.log(err);
                            }).finally(() => {
                                setOpenDetail(false)
                            })
                        }}>
                            Update
                        </Button>
                        <Button variant="text" autoFocus onClick={() => setOpenDetail(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Are you sure want to delete this transaction?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => {
                            setIsModalOpen(false)
                        }}>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={() => {
                            axios.post('/admin/users/delete/transactionHistory', { _id: deleteID }).then(res => {
                                if (res.data.success) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: res.data.message,
                                            variant: 'alert',
                                            alert: {
                                                color: 'success',
                                                severity: 'success'
                                            },
                                            close: false
                                        })
                                    );
                                    dispatch(getPaymentHistory(page, dateRange, selectedOptions))
                                }
                            }).catch(err => {
                                console.log(err);
                            }).finally(() => {
                                setDeleteID(null)
                                setIsModalOpen(false)
                            })
                        }} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </MainCard>
        </>
    );
};


export default TransactionHistory;
