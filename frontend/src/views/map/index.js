import React, { useEffect } from 'react';
import GoogleMap from 'google-map-react';
import DefaultAvatar from 'assets/images/auth/default.png';
import Avatar from 'ui-component/extended/Avatar';
import { getUsers } from '../../store/slices/map';
import { useDispatch, useSelector } from '../../store';
import useAuth from 'hooks/useAuth';
import { Link } from 'react-router-dom';
import { SERVER_URL } from 'config';

const Index = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  console.log(user.latitude);
  console.log(user.longitude);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMap
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: ['places']
        }}
        yesIWantToUseGoogleMapApiInternals
        center={[user?.latitude < 90 ? user?.latitude : 180 - user?.latitude, user?.longitude < 180 ? user?.longitude : 360 - user?.longitude]}
        zoom={9}
        defaultZoom={10}
      >
        <Avatar
          lat={user?.latitude < 90 ? user?.latitude : 180 - user?.latitude}
          lng={user?.longitude < 180 ? user?.longitude : 360 - user?.longitude}
          alt={user?.username}
          src={user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user.profile.avatar : DefaultAvatar}
          tooltip={user?.username}
          component={Link}
          to={'/personal/profile'}
        />

      </GoogleMap>
    </div>
  );
};

export default Index;
