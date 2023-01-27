import React, { useEffect } from 'react';

import { Grid } from '@mui/material';
import { messaging, getToken } from 'firebaseConfig';

const Index = () => {
    useEffect(() => {
        // Token can be sent to server from here.
        getToken(messaging, { vapidKey: 'BPPYdIu5ghzit4OvHjje7HOoXgB1wN4NvoBVjPhsn2BtZsw3gFdipAat-Weyi1JBOoVoOKFo4x2gFJh-aYDaR90' })
            .then((currentToken) => {
                if (currentToken) {
                    console.log(currentToken);
                    // Send the token to your server and update the UI if necessary
                    // ...
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                    // ...
                }
            })
            .catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
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
