import React, { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, InputAdornment, OutlinedInput, Pagination, Typography, MenuItem, TextField, ListItemText, Checkbox, Select, FilledInput } from '@mui/material';

// project imports
import UserList from './UserList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons';
import { getUserList } from 'store/slices/user';
import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';

// ==============================|| USER LIST STYLE 2 ||============================== //

const Index = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const networkFilterRef = useRef(null)
    const { isLoggedIn, user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [keyword, setKeyword] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [value, setValue] = React.useState('Suggested');
    const [trustNetworkValue, setTrustNetworkValue] = React.useState([]);

    const userState = useSelector((state) => state.user);

    React.useEffect(() => {
        setUsers(isLoggedIn ? userState.users.filter((item) => item.id != user._id) : userState.users);
        setTotal(userState.total);
        setLoading(userState.loading);
    }, [userState]);

    React.useEffect(() => {
        dispatch(getUserList());
    }, []);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setKeyword(newString || '');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            dispatch(getUserList(keyword, page, value, trustNetworkValue));
        }
    };

    const handlePeopleFilter = (e) => {
        setValue(e.target.value)
        dispatch(getUserList(keyword, page, e.target.value, trustNetworkValue));
    }
    const status = [
        {
            value: 'Suggested',
            label: 'Suggested'
        },
        {
            value: 'All',
            label: 'All'
        }
    ];
    const trustNetwork = [
        {
            value: "TrustsMe",
            label: "Trusts me"
        },
        {
            value: "TrustedByMe",
            label: "Trusted"
        }
    ]

    return (
        <MainCard
            sx={{
                ".MuiCardHeader-action": {
                    display: "flex",
                    flex: "unset"
                }
            }}
            title={
                <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h3">People</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container sx={{ justifyContent: { xs: 'left' } }} spacing={1} style={{ justifyContent: "right" }} >
                            <Grid item xs={12} sm={4} xl={2}>
                                <OutlinedInput
                                    disabled={loading}
                                    fullWidth
                                    id="input-search-list-style2"
                                    placeholder="Search"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconSearch stroke={1.5} size="16px" />
                                        </InputAdornment>
                                    }
                                    size="small"
                                    onChange={handleSearch}
                                    onKeyPress={handleKeyPress}
                                    value={keyword}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} xl={2}>
                                <TextField disabled={loading} id="standard-select-currency" fullWidth select value={value} onChange={handlePeopleFilter} sx={{ "& .MuiSelect-select": { padding: "10px 32px 10px 14px", minWidth: 70 } }}>
                                    {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4} xl={2}>
                                <Select
                                    open={isDropdownOpen}
                                    fullWidth
                                    onClose={() => setIsDropdownOpen(false)}
                                    disabled={loading}
                                    id="standard-select-currency"
                                    multiple
                                    onOpen={() => setIsDropdownOpen(true)}
                                    displayEmpty
                                    value={trustNetworkValue}
                                    renderValue={(selected) => {
                                        let x = selected.map(s => {
                                            return trustNetwork.find(e => e.value == s)?.label
                                        }).join(', ')
                                        return x.trim().length == 0 ? "None" : x
                                    }}
                                    onChange={(e) => {
                                        setTrustNetworkValue(e.target.value)
                                        clearTimeout(networkFilterRef.current)
                                        networkFilterRef.current = setTimeout(() => {
                                            setIsDropdownOpen(false)
                                            dispatch(getUserList(keyword, page, value, e.target.value));
                                        }, 1000);
                                    }}
                                    sx={{
                                        "& .MuiSelect-select": { padding: "10px 32px 10px 14px" }
                                    }}
                                >
                                    {trustNetwork.map((option) => (
                                        // <MenuItem key={option.value} value={option.value} >
                                        //     {option.label}
                                        // </MenuItem>
                                        <MenuItem key={option.value} value={option.value} >
                                            <Checkbox checked={trustNetworkValue.indexOf(option.value) > -1} />
                                            <ListItemText primary={option.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
            }
        >

            <UserList users={users} loading={loading} />
            {users?.length ? <Grid item xs={12} sx={{ mt: 1.75 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination
                            count={Math.ceil(total / 10)}
                            page={page}
                            onChange={(e, p) => {
                                setPage(p);
                                dispatch(getUserList(keyword, p, value, trustNetworkValue));
                            }}
                            color="secondary"
                        />
                    </Grid>
                </Grid>
            </Grid> : <></>}
        </MainCard >
    );
};

export default Index;
