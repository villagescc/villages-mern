import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  CardContent,
  ClickAwayListener,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { messaging, getToken, onMessage } from 'firebaseConfig';

// project imports
import UserDetails from './UserDetails';
import ChatDrawer from './ChatDrawer';
import ChartHistory from './ChartHistory';
import AvatarStatus from './AvatarStatus';
import { openDrawer } from 'store/slices/menu';
import MainCard from 'ui-component/cards/MainCard';
import Avatar from 'ui-component/extended/Avatar';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import { getState, getUser, getUserChats, insertChat } from 'store/slices/chat';

// assets
import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import VideoCallTwoToneIcon from '@mui/icons-material/VideoCallTwoTone';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import MoodTwoToneIcon from '@mui/icons-material/MoodTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import useAuth from 'hooks/useAuth';
import { isEmpty } from 'lodash';
import ChatEmptyCard from './EmptyCard';
import { getUsers } from 'store/slices/user';
import { SERVER_URL } from 'config';

import DefaultUserIcon from 'assets/images/auth/default.png';
import axios from 'axios';
import moment from 'moment';

// drawer content element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  paddingLeft: open ? theme.spacing(3) : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: 0
  })
}));

// ==============================|| APPLICATION CHAT ||============================== //

const ChatMainPage = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();

  const { userId } = useParams();

  useEffect(() => {
    if (!!userId) {
      setOpenChatDrawer(true);
      dispatch(getUser(userId));
    }
  }, [userId]);

  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView();
    }
  });

  onMessage(messaging, (payload) => {
    console.log(payload);
    console.log(payload.data.senderid);
    const newData = [...data];
    newData.push({
      sender: payload.data.senderid,
      text: payload.notification.body,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    setData(newData);
  });

  const { user: authUser } = useAuth();

  // set chat details page open when user is selected from sidebar
  const [emailDetails, setEmailDetails] = React.useState(false);
  const handleUserChange = () => {
    setEmailDetails((prev) => !prev);
  };

  // toggle sidebar
  const [openChatDrawer, setOpenChatDrawer] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setOpenChatDrawer(!matchDownSM);
  }, [matchDownSM]);

  // const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [data, setData] = React.useState([]);
  const chatState = useSelector((state) => state.chat);

  useEffect(() => {
    setUser(chatState.user);
  }, [chatState.user]);

  useEffect(() => {
    console.log(chatState.chats);
    setData(chatState.chats);
  }, [chatState.chats]);

  useEffect(() => {
    dispatch(openDrawer(false));
    dispatch(getState());
    dispatch(getUsers());

    // getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
    //     .then((currentToken) => {
    //         if (currentToken) {
    //             setToken(currentToken);
    //         } else {
    //             console.log('No registration token available. Request permission to generate one.');
    //         }
    //     })
    //     .catch((err) => {
    //         console.log('An error occurred while retrieving token. ', err);
    //     });
  }, []);

  useEffect(() => {
    if (user?.user?._id) dispatch(getUserChats(user.user._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // handle new message form
  const [message, setMessage] = useState('');
  const handleOnSend = () => {
    const d = new Date();
    console.log(user);
    console.log(user.user);
    console.log(user.user.deviceToken);
    setMessage('');
    const newMessage = {
      sender: authUser._id,
      recipient: user?.user?._id,
      text: message
    };
    setData((prevState) => [...prevState, newMessage]);
    dispatch(insertChat(newMessage));
    axios.post('https://us-central1-villages-io-cbb64.cloudfunctions.net/broadcast', {
      receiverFcm: user?.user?.deviceToken,
      message: message,
      type: 'chat',
      senderid: authUser._id,
      sender: authUser.username,
      image: authUser.profile.avatar
    });
  };

  const handleEnter = (event) => {
    if (event?.key !== 'Enter') {
      return;
    }
    handleOnSend();
  };

  // handle emoji
  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const [anchorElEmoji, setAnchorElEmoji] = React.useState(); /** No single type can cater for all elements */
  const handleOnEmojiButtonClick = (event) => {
    setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  };

  const emojiOpen = Boolean(anchorElEmoji);
  const emojiId = emojiOpen ? 'simple-popper' : undefined;
  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ChatDrawer openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} setUser={setUser} />
      {isEmpty(user) ? (
        <Main theme={theme} open={openChatDrawer}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <ChatEmptyCard openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} />
            </Grid>
          </Grid>
        </Main>
      ) : (
        <Main theme={theme} open={openChatDrawer}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth sx={{ display: emailDetails ? { xs: 'none', sm: 'flex' } : 'flex' }}>
              <MainCard
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                }}
              >
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={0.5}>
                      <Grid item>
                        <IconButton onClick={handleDrawerOpen} size="large">
                          <MenuRoundedIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                          <Grid item>
                            <Avatar
                              alt={user.name}
                              src={
                                user?.user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user?.user?.profile?.avatar : DefaultUserIcon
                              }
                            />
                          </Grid>
                          <Grid item sm zeroMinWidth>
                            <Grid container spacing={0} alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="h4" component="div">
                                  {user?.user?.username} {user.state && <AvatarStatus status={user.state} />}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                {/* TOOD */}
                                <Typography variant="subtitle2">Last seen {user.lastMessage}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sm zeroMinWidth />
                      <Grid item>
                        <IconButton onClick={handleUserChange} size="large">
                          <ErrorTwoToneIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider sx={{ mt: theme.spacing(2) }} />
                  </Grid>
                  <PerfectScrollbar style={{ width: '100%', height: 'calc(100vh - 440px)', overflowX: 'hidden', minHeight: 525 }}>
                    <CardContent>
                      <ChartHistory
                        theme={theme}
                        handleUserDetails={handleUserChange}
                        handleDrawerOpen={handleDrawerOpen}
                        user={user}
                        data={data}
                      />
                      <span ref={scrollRef} />
                    </CardContent>
                  </PerfectScrollbar>
                  <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <IconButton ref={anchorElEmoji} aria-describedby={emojiId} onClick={handleOnEmojiButtonClick} size="large">
                          <MoodTwoToneIcon />
                        </IconButton>
                        <Popper
                          id={emojiId}
                          open={emojiOpen}
                          anchorEl={anchorElEmoji}
                          disablePortal
                          modifiers={[
                            {
                              name: 'offset',
                              options: {
                                offset: [-20, 20]
                              }
                            }
                          ]}
                        >
                          <ClickAwayListener onClickAway={handleCloseEmoji}>
                            <>
                              {emojiOpen && (
                                <MainCard elevation={8} content={false}>
                                  <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK} disableAutoFocus />
                                </MainCard>
                              )}
                            </>
                          </ClickAwayListener>
                        </Popper>
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <TextField
                          fullWidth
                          label="Type a Message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleEnter}
                        />
                      </Grid>
                      <Grid item>
                        <IconButton size="large">
                          <AttachmentTwoToneIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" onClick={handleOnSend} size="large">
                          <SendTwoToneIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            {emailDetails && (
              <Grid item sx={{ margin: { xs: '0 auto', md: 'initial' } }}>
                <Box sx={{ display: { xs: 'block', sm: 'none', textAlign: 'right' } }}>
                  <IconButton onClick={handleUserChange} sx={{ mb: -5 }} size="large">
                    <HighlightOffTwoToneIcon />
                  </IconButton>
                </Box>
                <UserDetails user={user} />
              </Grid>
            )}
          </Grid>
        </Main>
      )}
    </Box>
  );
};

export default ChatMainPage;
