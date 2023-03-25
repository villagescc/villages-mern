import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, Chip, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';

// project imports
// import Avatar from '../extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
// import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';

const avatarImage = require.context('assets/images/profile', true);

// styles
const FacebookWrapper = styled(Button)({
  padding: 8,
  background: 'rgba(66, 103, 178, 0.2)',
  '& svg': {
    color: '#4267B2'
  },
  '&:hover': {
    background: '#4267B2',
    '& svg': {
      color: '#fff'
    }
  }
});

const TwitterWrapper = styled(Button)({
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

const LinkedInWrapper = styled(Button)({
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

// ==============================|| USER SIMPLE CARD ||============================== //

const EmptyCard = ({ avatar, name, status }) => {
  const theme = useTheme();
  const avatarProfile = avatar && avatarImage(`./${avatar}`);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        p: 2,
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'transparent' : theme.palette.grey[100],
        '&:hover': {
          border: `1px solid${theme.palette.primary.main}`
        }
      }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <TwitterWrapper fullWidth>
            <TwitterIcon fontSize="small" />
          </TwitterWrapper>
        </Grid>
      </Grid>
    </Card>
  );
};

EmptyCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string
};

export default EmptyCard;
