import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, InputAdornment, OutlinedInput, Pagination, Typography, MenuItem, TextField } from '@mui/material';

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

    const { isLoggedIn, user } = useAuth();

    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [keyword, setKeyword] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [value, setValue] = React.useState('Suggested');

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
            dispatch(getUserList(keyword, page, value));
        }
    };

    const handlePeopleFilter = (e) => {
        setValue(e.target.value)
        dispatch(getUserList(keyword, page, e.target.value));
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

    return (
        <MainCard
            title={
                <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">People</Typography>
                    </Grid>
                    <Grid item style={{ display: 'flex', alignItems: "center", gap: '5px' }}>
                        <Grid item>
                            <OutlinedInput
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
                        <Grid item>
                            <TextField id="standard-select-currency" select value={value} onChange={handlePeopleFilter} sx={{ "& .MuiSelect-select": { padding: "10px 32px 10px 14px", minWidth: 70 } }}>
                                {status.map((option) => (
                                    <MenuItem key={option.value} value={option.value} >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                                dispatch(getUserList(keyword, p, value));
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
