import React from 'react';
import GoogleMap from 'google-map-react';
import DefaultAvatar from "assets/images/auth/default.png";
import Avatar from "ui-component/extended/Avatar";
import {getUsers} from "../../store/slices/map";
import {useDispatch, useSelector} from "../../store";

const Index = () => {
  const dispatch = useDispatch();

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMap
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: ['places']
        }}
        yesIWantToUseGoogleMapApiInternals
        center={[19.741755, -155.844437]}
        zoom={9}
        defaultZoom={10}
      >
        {/*{*/}
        {/*  users.map((user, index) => (*/}
            <Avatar
              lat={19.741755} lng={-155.844437}
              alt={"a"}
              src={DefaultAvatar}
              tooltip={"a"}
            />
        {/*  ))*/}
        {/*}*/}
      </GoogleMap>
    </div>
  );
};

export default Index;
