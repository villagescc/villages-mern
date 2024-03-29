import React, { useEffect, useState, useLayoutEffect, useRef, useCallback, memo } from 'react';
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
import { messaging, getToken, onMessage, hasFirebaseMessagingSupport } from 'firebaseConfig';

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
import axios from 'utils/axios';
import moment from 'moment';
import { io } from 'socket.io-client';

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
  const messageRef = useRef(null)
  const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
  const SocketRef = useRef(null)
  const dispatch = useDispatch();

  const { userId } = useParams();

  useEffect(() => {
    if (!!userId) {
      if (matchDownSM) setOpenChatDrawer(false);
      else setOpenChatDrawer(true);
      dispatch(getUser(userId));
    }
  }, [userId, matchDownSM]);

  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView();
    }
  });

  // console.log(hasFirebaseMessagingSupport, "<== Is supported")
  if (hasFirebaseMessagingSupport) {
    // console.log(hasFirebaseMessagingSupport, "<== Is supported True")
    onMessage(messaging, (payload) => {
      const newData = [...data];
      newData.push({
        sender: payload.data.senderid,
        text: payload.notification.body,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      // setData(newData);
    });
  }

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
  const [socket, setSocket] = useState(null)
  const [data, setData] = React.useState([]);
  const chatState = useSelector((state) => state.chat);

  useEffect(() => {
    setUser(chatState.user[0] ?? {});
  }, [chatState.user]);

  useEffect(() => {
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



  // Handle Socket

  // useEffect(() => {
  //   let socketIO = io(SERVER_URL, { reconnection: false })
  //   console.log(SERVER_URL, 'SERVER_URL');
  //   setSocket(socketIO)
  //   SocketRef.current = socketIO
  //   return () => {
  //     console.log("Socket Disconnet", 'disconnect');
  //     SocketRef.current?.disconnect();
  //   }
  // }, [])

  // setInterval(() => {
  //   console.log(SocketRef.current?.id, "id")
  // }, 3000);

  // useEffect(() => {
  //   if (SocketRef.current?.id) {
  //     let socketId = SocketRef.current?.id
  //     window.addEventListener('beforeunload', () => {
  //       SocketRef.current.disconnect();
  //     });
  //     setInterval(() => {
  //       // console.log(socket.id, 'chatId');
  //     }, 1000);
  //     // socket.emit('new user connected', { id: socket.id, userId: authUser._id });
  //     // console.log(socket?.id, 'connected');
  //     axios.post('/userConnected', { id: SocketRef.current.id, userId: authUser._id })
  //     // socket.on("connection", s => {
  //     //   s.join("some room");
  //     // });
  //     SocketRef.current.emit('join', 'roomname');
  //     SocketRef.current.on('newChat', (chat) => {
  //       // dispatch(getState());
  //       console.log(chat, 'chat from socket');
  //       setData((prevState) => [...prevState, {
  //         sender: chat.sender,
  //         recipient: chat.recipient,
  //         text: chat.text
  //       }]);
  //     })
  //     SocketRef.current.on('disconnect', (e) => {
  //       axios.post('/userDisconnected', { id: socketId, userId: authUser._id })
  //       // console.log(socketId, 'disconnected');
  //     })
  //     SocketRef.current.on('connectToRoom', function (data) {
  //       console.log(data);
  //     });
  //     // socket.emit('identification', { userId: authUser?._id });
  //     // socket.on('private', function (msg) {
  //     //   // alert(msg);
  //     //   console.log(msg, 'msg');
  //     // });
  //   }
  // }, [SocketRef?.current?.id])


  // handle new message form
  // const [message, setMessage] = useState('');
  const handleOnSend = () => {
    const d = new Date();
    // setMessage('');
    const newMessage = {
      sender: authUser._id,
      recipient: user?.user?._id,
      text: messageRef.current.value,
      senderSocketId: SocketRef.current?.id,
      senderEmail: authUser?.email,
      recipientEmail: user?.user?.email,
      authUser: authUser,
      loggedInUser: user
    };
    SocketRef.current.emit('newChat', newMessage)
    setData((prevState) => [...prevState, newMessage]);
    dispatch(insertChat(newMessage));
    messageRef.current.value = ''
    axios.post('https://us-central1-villages-io-cbb64.cloudfunctions.net/broadcast', {
      receiverFcm: user?.user?.deviceToken,
      message: newMessage.text,
      type: 'chat',
      senderid: authUser._id,
      sender: authUser.username,
      image: authUser.profile.avatar
    });
    // axios
    //   .post('https://us-central1-villages-io-cbb64.cloudfunctions.net/sendMail', {
    //     subject: `Chat Message Notification`,
    //     dest: user?.user?.email,
    //     data: `<h1>You have unread message from ${authUser?.firstName} ${authUser?.lastName}</h1>
    //           <h2>Hello ${user?.user?.firstName} ${user?.user?.lastName}</h2>
    //           <p>New message arrived from ${authUser?.firstName} ${authUser?.lastName}(${authUser.username}) like below:</p>
    //           <br>
    //           <div style="border: 2px solid #dedede; background-color:#f1f1f1; border-radius: 20px; padding 10px; margin: 10px 0; width:60%">
    //             <p>${newMessage.text}</p>
    //             <span style="float:right; color:#999">${moment().format('YYYY-MM-DD HH:mm:ss')}</span>
    //           </div>
    //           <br>
    //           To go to check message directly <a href=https://villages.io/personal/message/${authUser._id}> Click here</a>
    //           <br>`
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   })
  };

  const handleEnter = (event) => {
    if (event?.key !== 'Enter') {
      return;
    }
    handleOnSend();
  };

  // handle emoji
  const onEmojiClick = (event, emojiObject) => {
    // setMessage(message + emojiObject.emoji);
    messageRef.current.value = messageRef.current.value + emojiObject.emoji
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

  const renderChatHistory = useCallback(() => {
    return (
      <ChartHistory
        setData={setData}
        theme={theme}
        SocketRef={SocketRef}
        handleUserDetails={handleUserChange}
        handleDrawerOpen={handleDrawerOpen}
        user={user}
        data={data}
      />
    )
  }, [theme, user, data, SocketRef])

  const chatDrawer = useCallback(() => {
    return (
      <ChatDrawer openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} setUser={setUser} />
    )
  }, [openChatDrawer, setUser])


  const emptyChatCard = useCallback(() => {
    return (
      <ChatEmptyCard openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} />
    )
  }, [openChatDrawer, setUser])

  const userDetails = useCallback(() => {
    return (
      <UserDetails user={user} />)
  }, [user])


  return (
    <Box sx={{ display: 'flex' }}>
      {chatDrawer()}
      {isEmpty(user) ? (
        <Main theme={theme} open={openChatDrawer}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              {emptyChatCard()}
            </Grid>
          </Grid>
        </Main>
      ) : (
        <Main theme={theme} open={openChatDrawer}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth sx={{ display: emailDetails ? { xs: 'none', sm: 'flex' } : 'flex' }}>
              <MainCard
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
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
                                  {user?.user?.username}
                                  {/* {user.state && <AvatarStatus status={user.state} />} */}
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
                      {renderChatHistory()}
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
                          inputRef={messageRef}
                          label="Type a Message"
                          // value={message}
                          // onChange={(e) => {
                          //   setMessage(e.target.value)
                          // }}
                          onKeyPress={(e) => {
                            if (messageRef.current.value.trim().length !== 0) {
                              handleEnter(e)
                            }
                          }}
                        />
                      </Grid>
                      {/* <Grid item>
                        <IconButton size="large">
                          <AttachmentTwoToneIcon />
                        </IconButton>
                      </Grid> */}
                      <Grid item>
                        <IconButton color="primary" onClick={(e) => {
                          if (messageRef.current.value.trim().length !== 0) {
                            handleOnSend(e)
                          }
                        }} size="large">
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
                {userDetails()}
              </Grid>
            )}
          </Grid>
        </Main>
      )}
    </Box>
  );
};

export default memo(ChatMainPage);
