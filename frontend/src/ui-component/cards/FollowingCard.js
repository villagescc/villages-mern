import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, Card, Grid, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { SERVER_URL } from 'config';
// assets

import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';

import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import DefaultUserIcon from '../../assets/images/auth/default.png';

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

  return (
    <Card
      sx={{
        padding: '16px',
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100],
        '&:hover': {
          border: `1px solid${theme.palette.primary.main}`
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar alt="User 1" src={avatarProfile} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography
                variant="h5"
                component="div"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                {following.username}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <PinDropTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                {following?.profile?.placeId}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <FavoriteTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                {following?.endorsement?.weight}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
              >
                <DescriptionTwoToneIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                {following?.endorsement?.text}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" fullWidth startIcon={<PeopleAltTwoToneIcon />}>
            following
          </Button>
        </Grid>
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
