import PropTypes from 'prop-types';
import { useEffect, useState, Fragment } from 'react';

// material-ui
import { Chip, Divider, Grid, List, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import UserAvatar from './UserAvatar';

import { useDispatch, useSelector } from 'store';
import { getUser, getUserChats, getUsers } from 'store/slices/chat';
import { Link } from 'react-router-dom';

// ==============================|| CHAT USER LIST ||============================== //

const UserList = ({ setUser }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { users } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <List component="nav">
      {data.map((user, key) => (
        <Fragment key={user?.user?._id}>
          <ListItemButton
            // onClick={() => {
            //   //   dispatch(getUser(user?.user?._id));
            //   setUser(user);
            // }}
            component={Link}
            to={`/personal/message/${user?.user?._id}`}
          >
            <ListItemAvatar>
              <UserAvatar user={{ online_status: user.state, avatar: user?.user?.profile?.avatar }} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Grid container alignItems="center" spacing={1} component="span">
                  <Grid item xs zeroMinWidth component="span">
                    <Typography
                      variant="h5"
                      color="inherit"
                      component="span"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                      }}
                    >
                      {user?.user?.username}
                    </Typography>
                  </Grid>
                  <Grid item component="span">
                    <Typography component="span" variant="subtitle2">
                      {user?.lastMessage}
                    </Typography>
                  </Grid>
                </Grid>
              }
              secondary={
                <Grid container alignItems="center" spacing={1} component="span">
                  <Grid item xs zeroMinWidth component="span">
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                      }}
                    >
                      {user?.user?.profile?.name}
                    </Typography>
                  </Grid>
                </Grid>
              }
            />
          </ListItemButton>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

UserList.propTypes = {
  setUser: PropTypes.func
};

export default UserList;
