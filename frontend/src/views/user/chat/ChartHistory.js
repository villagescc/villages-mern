import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef } from 'react';

// material-ui
import { Card, CardContent, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import moment from 'moment';
import { io } from 'socket.io-client';
import { SERVER_URL } from 'config';
import axios from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

const ChartHistory = ({ data, theme, user, setData, SocketRef }) => {
  // const SocketRef = useRef(null)
  const params = useParams()
  const { user: authUser } = useAuth();
  useEffect(() => {
    let socketIO = io(SERVER_URL)
    // console.log(SERVER_URL, 'SERVER_URL');
    // setSocket(socketIO)
    SocketRef.current = socketIO
    return () => {
      // console.log("Socket Disconnet", 'disconnect');
      SocketRef.current?.disconnect();
    }
  }, [params?.userId])
  useEffect(() => {
    if (SocketRef.current?.id) {
      let socketId = SocketRef.current?.id
      window.addEventListener('beforeunload', () => {
        SocketRef.current.disconnect();
      });
      setInterval(() => {
        // console.log(socket.id, 'chatId');
      }, 1000);
      // socket.emit('new user connected', { id: socket.id, userId: authUser._id });
      // console.log(socket?.id, 'connected');
      axios.post('/userConnected', { id: SocketRef.current.id, userId: authUser._id })
      // socket.on("connection", s => {
      //   s.join("some room");
      // });
      SocketRef.current.emit('join', 'roomname');
      SocketRef.current.on('newChat', (chat) => {
        // dispatch(getState());
        // console.log(chat, 'chat from socket');
        if (chat.recipient == params?.userId || chat.sender == params?.userId) {
          setData((prevState) => [...prevState, {
            sender: chat.sender,
            recipient: chat.recipient,
            text: chat.text
          }]);
        }
      })
      SocketRef.current.on('disconnect', (e) => {
        axios.post('/userDisconnected', { id: socketId, userId: authUser._id })
        // console.log(socketId, 'disconnected');
      })
      SocketRef.current.on('connectToRoom', function (data) {
        console.log(data);
      });
      // socket.emit('identification', { userId: authUser?._id });
      // socket.on('private', function (msg) {
      //   // alert(msg);
      //   console.log(msg, 'msg');
      // });
    }
  }, [SocketRef?.current?.id])
  // setInterval(() => {
    // console.log(SocketRef.current?.id, "id")
  // }, 3000);
  return (
    <Grid item xs={12}>
      <Grid container spacing={gridSpacing}>
        {data.map((history, index) => {
          return (
            <React.Fragment key={index}>
              {(history.sender !== user?.user?._id) ? (
                <Grid item xs={12}>
                  <Grid container spacing={gridSpacing}>
                    <Grid item xs={2} />
                    <Grid item xs={10}>
                      <Card
                        sx={{
                          display: 'inline-block',
                          float: 'right',
                          bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                        }}
                      >
                        <CardContent sx={{ p: 2, pb: '16px !important', width: 'fit-content', ml: 'auto' }}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color={theme.palette.mode === 'dark' ? 'dark.900' : ''}>
                                {history.text}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography align="right" variant="subtitle2" color={theme.palette.mode === 'dark' ? 'dark.900' : ''}>
                                {moment(history.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={7}>
                      <Card
                        sx={{
                          display: 'inline-block',
                          float: 'left',
                          background: theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light
                        }}
                      >
                        <CardContent sx={{ p: 2, pb: '16px !important' }}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="body2">{history.text}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography align="right" variant="subtitle2">
                                {moment(history.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </React.Fragment>
          )
        })}
      </Grid>
    </Grid>
  );
}

ChartHistory.propTypes = {
  theme: PropTypes.object,
  data: PropTypes.array,
  user: PropTypes.object
};

export default memo(ChartHistory);
