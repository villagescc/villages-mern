import React from 'react';
import GoogleMap from 'google-map-react';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import DefaultAvatar from "assets/images/auth/default.png";
import Avatar from "ui-component/extended/Avatar";
import {getUsers} from "../../store/slices/map";
import {useDispatch, useSelector} from "../../store";

const Index = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([]);

  const mapState = useSelector((state) => state.map);

  React.useEffect(() => {
    setUsers(mapState.users.filter(user => user.profile.placeId).map(user => {
      return geocodeByPlaceId(user.profile.placeId)
        .then(results => getLatLng(results[0]))
        .then(latLng => ({
          username: user.username,
          avatar: user.profile.avatar,
          latitude: latLng
        }))
    }));
  }, [])

  React.useEffect(() => {
    dispatch(getUsers());
  }, []);

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
        {
          users.map((user, index) => (
            <Avatar
              key={index}
              lat={15.741755 + index} lng={-155.844437}
              alt={user.username}
              src={user.avatar ? 'http://localhost:5000/upload/avatar/'+user.avatar : DefaultAvatar}
              tooltip={user.username}
            />
          ))
        }
      </GoogleMap>
    </div>
  );
};

export default Index;
