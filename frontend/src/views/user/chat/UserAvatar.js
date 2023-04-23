import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { Avatar, Badge } from '@mui/material';

// project imports
import AvatarStatus from './AvatarStatus';
import DefaultUserIcon from 'assets/images/auth/default.png';
import { SERVER_URL } from 'config';

// ==============================|| CHAT USER AVATAR WITH STATUS ICON ||============================== //

const UserAvatar = ({ user }) => {
  const now = Date.now();
  const loginDate = new Date(user.last_login);
  const activePeriod = now - loginDate;
  if (user.online_status === 'Online') {
    if (activePeriod < 60 * 60 * 24 * 1000) {
      user.online_status = 'Online';
    } else {
      user.online_status = 'Offline';
    }
  }
  return (
    <Badge
      overlap="circular"
      badgeContent={<AvatarStatus status={user.online_status} />}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <Avatar alt={user.name} src={user.avatar ? `${SERVER_URL}/upload/avatar/` + user.avatar : DefaultUserIcon} />
    </Badge>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.object
};

export default UserAvatar;
