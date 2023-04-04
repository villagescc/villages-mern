import * as React from 'react';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, InputAdornment, OutlinedInput, Pagination, Typography } from '@mui/material';

// third-party
import { io } from 'socket.io-client';

// project imports
import EndorsementCard from 'ui-component/cards/EndorsementCard';
import { gridSpacing } from 'store/constant';
import CreateModal from './CreateModal';
import EndorsementCardSkeleton from 'ui-component/cards/Skeleton/EndorsementCard';

import { useDispatch, useSelector } from 'store';
import { searchEndorsements, getUsers, saveEndorsement } from 'store/slices/endorsement';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import { IconSearch } from '@tabler/icons';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { SERVER_URL } from 'config';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import Empty from 'ui-component/Empty';
import { getUserList } from '../../../store/slices/user';

import { messaging, onMessage } from 'firebaseConfig';

const Index = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [total, setTotal] = useState(0);
  const [endorsements, setEndorsements] = useState([]);
  const [users, setUsers] = useState([]);
  const [endorsement, setEndorsement] = useState({
    text: 'Trust him'
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [openCreate, setOpenCreate] = React.useState(false);

  // get all users details
  const endorsementState = useSelector((state) => state.endorsement);

  useEffect(() => {
    setEndorsements(endorsementState.endorsements);
    setUsers(endorsementState.users);
    setLoading(endorsementState.loading);
    setTotal(endorsementState.total);
    setErrors(endorsementState.errors);
  }, [endorsementState]);

  useEffect(() => {
    dispatch(searchEndorsements());
    dispatch(getUsers());
    setSocket(io(SERVER_URL));
  }, []);

  useEffect(() => {
    if (!!userId) {
      if (!!endorsements.find((endorsement) => endorsement.user._id === userId)) {
        setEndorsement({
          recipient: userId,
          text: endorsements.find((endorsement) => endorsement.user._id === userId).send_text,
          weight: endorsements.find((endorsement) => endorsement.user._id === userId).send_weight
        });
      } else {
        setEndorsement({
          recipient: userId
        });
      }
      setOpenCreate(true);
    }
  }, [userId, endorsements]);

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        if (notification.recipientId === user._id && notification.notificationType === 'TRUST') dispatch(searchEndorsements(keyword, page));
      });
    }
  }, [socket]);

  const handleSearchType = (e) => {
    if (e.keyCode === 13) {
      setKeyword(e.target.value);
      dispatch(searchEndorsements(e.target.value, page));
    }
  };

  const handleNewClick = () => {
    setEndorsement({});
    setOpenCreate(true);
  };

  const handleSaveClick = () => {
    dispatch(saveEndorsement(endorsement, successAction));
  };

  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have created trust limit successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
    dispatch(searchEndorsements(keyword, page));
    setOpenCreate(false);
  };

  onMessage(messaging, (payload) => {
    dispatch(
      openSnackbar({
        open: true,
        message: payload.notification.body,
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid className="block" item xs zeroMinWidth sx={{ display: 'flex' }}>
          <Grid container alignItems="center" spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <OutlinedInput
                id="input-search-card-style1"
                placeholder="Search Contact"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                  </InputAdornment>
                }
                onKeyUp={handleSearchType}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleNewClick}>
                New
              </Button>
            </Grid>
            {loading ? (
              <Grid container direction="row" spacing={gridSpacing} sx={{ padding: 3 }}>
                {'123456789012'.split('').map((i, key) => (
                  <Grid item xs={12} md={6} lg={4} xl={3} key={key}>
                    <EndorsementCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : endorsements.length > 0 ? (
              <Grid container direction="row" spacing={gridSpacing} sx={{ padding: 3 }}>
                {endorsements.map((item, i) => (
                  <Grid item xs={12} md={6} lg={4} xl={3} key={i}>
                    <EndorsementCard
                      endorsement={item}
                      onActive={() => {
                        setEndorsement({
                          recipient: item.user._id,
                          text: item.send_text,
                          weight: item.send_weight
                        });
                        setOpenCreate(true);
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Pagination
                    count={Math.ceil(total / 12)}
                    page={page}
                    onChange={(e, p) => {
                      setPage(p);
                      dispatch(searchEndorsements(keyword, p));
                    }}
                    color="secondary"
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container direction="row" spacing={gridSpacing} sx={{ padding: 3 }}>
                <Grid item xs={12}>
                  <Empty />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <CreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleSaveClick}
        users={users}
        endorsement={endorsement}
        setEndorsement={setEndorsement}
        errors={errors}
      />
    </>
  );
};

export default Index;
