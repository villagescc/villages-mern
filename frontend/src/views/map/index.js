import React from 'react';
import GoogleMap from 'google-map-react';

const Index = () => {
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMap
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: ['visualization']
        }}
        yesIWantToUseGoogleMapApiInternals
        center={[19.741755, -155.844437]}
        zoom={9}
        defaultZoom={10}
      >
        <div lat={59.955413} lng={30.337844}>
          test location
        </div>
      </GoogleMap>
    </div>
  );
};

export default Index;
