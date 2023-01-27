import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { messaging, getToken } from 'firebaseConfig';

const Index = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Token can be sent to server from here.
        getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
            .then((currentToken) => {
                if (currentToken) {
                    setLoading(false);
                    console.log(currentToken);
                } else {
                    setLoading(false);
                    console.log('No registration token available. Request permission to generate one.');
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log('An error occurred while retrieving token. ', err);
            });
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
