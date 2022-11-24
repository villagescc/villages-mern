import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  TextField,
  Typography
} from '@mui/material';

// project imports
import UserList from './UserList';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons';
import {getUserList} from "../../../store/slices/user";
import { useDispatch, useSelector } from 'store';
import {filterPost} from "../../../store/slices/posting";

// ==============================|| USER LIST STYLE 2 ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [users, setUsers] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const userState = useSelector((state) => state.user);

  React.useEffect(() => {
    setUsers(userState.users);
    setTotal(userState.total);
  }, [userState]);

  React.useEffect(() => {
    dispatch(getUserList());
  }, []);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setKeyword(newString || '');
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      dispatch(getUserList(keyword, page))
    }
  }

  return (
    <MainCard
      title={
        <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">People</Typography>
          </Grid>
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
        </Grid>
      }
    >
      <UserList users={users} />
      <Grid item xs={12} sx={{ mt: 1.75 }}>
        <Grid container justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Pagination
              count={Math.ceil(total / 10)}
              page={page}
              onChange={(e, p) => {
                setPage(p)
                dispatch(getUserList(keyword, p))
              }}
              color="secondary"
            />
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Index;
