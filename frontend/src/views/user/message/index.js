import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { messaging, getToken, hasFirebaseMessagingSupport } from 'firebaseConfig';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Token can be sent to server from here.
    // console.log(hasFirebaseMessagingSupport, "<== Is supported")
    if (hasFirebaseMessagingSupport) {
      // console.log(hasFirebaseMessagingSupport, "<== Is supported True")
      getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            setLoading(false);
          } else {
            setLoading(false);
            console.log('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log('An error occurred while retrieving token. ', err);
        });
    }
  }, []);

  return (
    <Grid container>
      <Grid item sx={12}>
        Messages
      </Grid>
    </Grid>
  );
};

export default Index;
