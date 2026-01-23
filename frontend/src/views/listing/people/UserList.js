import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AvatarGroup, Button, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Chip } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import UserListSkeleton from 'ui-component/cards/Skeleton/UserList';
import { SERVER_URL } from 'config';

import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import DefaultAvatar from '../../../assets/images/auth/default.png';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import UserListCard from 'ui-component/cards/UserListCard';
import Empty from 'ui-component/Empty';

// ==============================|| USER LIST 2 ||============================== //

const UserList = ({ users, loading }) => {
  const theme = useTheme();

  return (
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
              <UserListSkeleton />
              <UserListSkeleton />
              <UserListSkeleton />
            </>
          ) : users?.length ? users?.map((user, index) => <UserListCard user={user} key={index} />) : <Empty />}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
