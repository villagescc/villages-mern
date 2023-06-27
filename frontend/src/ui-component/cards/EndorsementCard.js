import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Card, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import Avatar from '../extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoTOneIcon from '@mui/icons-material/DeleteTwoTone';
import DefaultUserIcon from '../../assets/images/auth/default.png';
import { SERVER_URL } from 'config';
import { Link } from 'react-router-dom';
// const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER CONTACT CARD ||============================== //

const EndorsementCard = ({ endorsement, onActive, onDelete }) => {
  const theme = useTheme();
  const { user, send_weight, send_text, receive_weight, receive_text, isUserUsedCredit } = endorsement;

  const avatarImage = user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user.profile.avatar : DefaultUserIcon;
  // console.log(user);

  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const handleClick = (event) => {
  //     setAnchorEl(event?.currentTarget);
  //   };

  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
        borderColor: theme.palette.grey[100]
      }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth component={Link} to={`/${user?.username}`} style={{ textDecoration: 'none' }}>
              <Avatar alt={user?.username} size="lg" src={avatarImage} sx={{ width: 72, height: 72 }} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" component="div">
            {user?.profile?.name}
          </Typography>
          <Typography variant="caption">{user?.profile?.job}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">Username</Typography>
          <Typography variant="h6">{user?.username}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">TRUST FROM YOU</Typography>
          <Typography variant="h5">{send_weight ? send_weight : 0} V.H.</Typography>
          <Typography variant="h6">{send_text ? send_text : 'No description'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">TRUST FROM THEM</Typography>
          <Typography variant="h5">{receive_weight ? receive_weight : 0} V.H.</Typography>
          <Typography variant="h6">{receive_text ? receive_text : 'No description'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" sx={{ width: '100%' }} startIcon={<EditTwoToneIcon />} onClick={onActive}>
                Edit
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" sx={{ width: '100%' }} startIcon={<DeleteTwoTOneIcon />} disabled={isUserUsedCredit} onClick={onDelete}>
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

EndorsementCard.propTypes = {
  avatar: PropTypes.string,
  contact: PropTypes.string,
  email: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  onActive: PropTypes.func,
  role: PropTypes.string
};

export default EndorsementCard;
