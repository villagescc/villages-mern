import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Grid, IconButton, InputAdornment, Menu, MenuItem, OutlinedInput, Typography, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import UserList from './UserList';
import AvatarStatus from './AvatarStatus';
import UserAvatar from './UserAvatar';
import useAuth from 'hooks/useAuth';
import MainCard from 'ui-component/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';

// assets
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useConfig from 'hooks/useConfig';
import { useDispatch } from 'store';
import { getUsers, searchUsers, setState } from 'store/slices/chat';
import { useSelector } from 'react-redux';

// ==============================|| CHAT DRAWER ||============================== //

const ChatDrawer = ({ handleDrawerOpen, openChatDrawer, setUser }) => {
  const theme = useTheme();

  const { user } = useAuth();
  const chatState = useSelector((state) => state.chat);
  const { users: allUsers } = useSelector((state) => state.user);
  const { borderRadius } = useConfig();
  const dispatch = useDispatch();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  // show menu to set current user status
  const [anchorEl, setAnchorEl] = useState();
  const handleClickRightMenu = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseRightMenu = () => {
    setAnchorEl(null);
  };

  const handleUserSearchInput = (event) => {
    if (event.target.value === '') {
      dispatch(getUsers());
    } else if (event.target.value.length >= 3) {
      dispatch(searchUsers(event.target.value));
    }
    // console.log(event.target.value.length);
    // if (event.target.value.length >= 3) dispatch(searchUsers(event.target.value));
  };

  // set user status on status menu click
  const [status, setStatus] = useState('Online');
  const handleRightMenuItemClick = (userStatus) => () => {
    setStatus(userStatus);
    dispatch(setState(userStatus));
    handleCloseRightMenu();
  };

  useEffect(() => {
    setStatus(chatState.state);
  }, [chatState]);

  const drawerBG = theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50';

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: { xs: 1100, lg: 0 },
        '& .MuiDrawer-paper': {
          height: matchDownLG ? '100%' : 'auto',
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          borderRadius: matchDownLG ? 'none' : `${borderRadius}px`
        }
      }}
      variant={matchDownLG ? 'temporary' : 'persistent'}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {openChatDrawer && (
        <MainCard
          sx={{
            bgcolor: matchDownLG ? 'transparent' : drawerBG
          }}
          border={!matchDownLG}
          content={false}
        >
          <Box sx={{ p: 3, pb: 2 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                  <Grid item>
                    <UserAvatar
                      user={{ online_status: status, avatar: user?.profile?.avatar, name: 'User 1', recentlyActive: user?.profile?.recentlyActive }}
                    />
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Typography align="left" variant="h4">
                      {user?.username}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleClickRightMenu} size="large">
                      <ExpandMoreIcon />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleCloseRightMenu}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={handleRightMenuItemClick('Online')}>
                        <AvatarStatus status="Online" mr={1} />
                        Online
                      </MenuItem>
                      <MenuItem onClick={handleRightMenuItemClick('Do not disturb')}>
                        <AvatarStatus status="Do not disturb" mr={1} />
                        Do not disturb
                      </MenuItem>
                      <MenuItem onClick={handleRightMenuItemClick('Offline')}>
                        <AvatarStatus status="Offline" mr={1} />
                        Offline
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <OutlinedInput
                  fullWidth
                  id="input-search-header"
                  placeholder="Search Users"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchTwoToneIcon fontSize="small" />
                    </InputAdornment>
                  }
                  onChange={handleUserSearchInput}
                />
              </Grid>
            </Grid>
          </Box>
          <PerfectScrollbar
            style={{
              overflowX: 'hidden',
              height: matchDownLG ? 'calc(100vh - 190px)' : 'calc(100vh - 445px)',
              minHeight: matchDownLG ? 0 : 520
            }}
          >
            <Box sx={{ p: 3, pt: 0 }}>
              <UserList setUser={setUser} />
            </Box>
          </PerfectScrollbar>
        </MainCard>
      )}
    </Drawer>
  );
};

ChatDrawer.propTypes = {
  handleDrawerOpen: PropTypes.func,
  openChatDrawer: PropTypes.bool,
  setUser: PropTypes.func
};

export default memo(ChatDrawer);
