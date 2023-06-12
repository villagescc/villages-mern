import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Button, Card, Grid, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { SERVER_URL } from 'config';
// assets

import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';

import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import DefaultUserIcon from '../../assets/images/auth/default.png';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';

// ==============================|| SOCIAL PROFILE - following CARD ||============================== //

const FollowingCard = (following) => {
  const theme = useTheme();
  const avatarProfile = following?.profile.avatar ? `${SERVER_URL}/upload/avatar/` + following?.profile?.avatar : DefaultUserIcon;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // styles
  const TrustWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(242,29,104,0.2)',
    '& svg': {
      color: '#f21d60'
    },
    '&:hover': {
      background: '#f21d60',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const PaymentWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(29, 161, 242, 0.2)',
    '& svg': {
      color: '#1DA1F2'
    },
    '&:hover': {
      background: '#1DA1F2',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const MessageWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(14, 118, 168, 0.12)',
    '& svg': {
      color: '#0E76A8'
    },
    '&:hover': {
      background: '#0E76A8',
      '& svg': {
        color: '#fff'
      }
    }
  });



  return (
    <Card
      sx={{
        height: '100%',
        padding: '16px',
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100],
        '&:hover': {
          border: `1px solid${theme.palette.primary.main}`
        }
      }}
    >
      <Grid container sx={{ height: '100%', alignContent: "space-between" }}>
        <Grid item xs={12} >
          <Grid container sx={{ alignItems: 'center' }} >
            <Grid item component={Link} to={`/${following?.username}`}>
              <Avatar alt="User 1" src={avatarProfile} sx={{ width: 50, height: 50 }} />
            </Grid>
            <Grid item xs zeroMinWidth sx={{ paddingLeft: '10px' }}>
              <Typography
                variant="h5"
                component={Link} to={`/${following?.username}`}
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                {following?.username}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <PinDropTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                {following?.profile?.placeId ? following?.profile?.placeId : '-'}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ padding: '5px' }}>
            <Typography
              variant="subtitle2"
              sx={{ mt: 0.25, display: 'block' }}
            >
              <DescriptionTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
              {following?.endorsement?.text ? following?.endorsement?.text : '-'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TrustWrapper fullWidth component={Link} to={`/trust/${following?._id}`}>
              <FavoriteIcon />
            </TrustWrapper>
          </Grid>
          <Grid item xs={4}>
            <PaymentWrapper fullWidth component={Link} to={`/pay/${following?._id}`}>
              <AccountBalanceWalletOutlined />
            </PaymentWrapper>
          </Grid>
          <Grid item xs={4}>
            <MessageWrapper fullWidth component={Link} to={`/personal/message/${following?._id}`}>
              <ChatIcon />
            </MessageWrapper>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
          <Button variant="outlined" fullWidth startIcon={<PeopleAltTwoToneIcon />}>
            following
          </Button>
        </Grid> */}
      </Grid>
    </Card>
  );
};

FollowingCard.propTypes = {
  avatar: PropTypes.string,
  follow: PropTypes.number,
  location: PropTypes.string,
  name: PropTypes.string
};

export default FollowingCard;
