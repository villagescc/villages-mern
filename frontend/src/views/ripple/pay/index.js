import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Grid } from '@mui/material';
import PaymentHistory from './PaymentHistory';
import PaymentDialog from './PaymentDialog';

const Index = () => {
    const { userId } = useParams();

    useEffect(() => {
        if (!!userId) setShowModal(true);
    }, [userId]);

    const [showModal, setShowModal] = useState(false);

    const handleCreateClick = () => {
        setShowModal(true);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <PaymentHistory title={'Payment History'} handleCreateClick={handleCreateClick} />
                <PaymentDialog open={showModal} setOpen={setShowModal} recipientId={userId} />
            </Grid>
        </Grid>
    );
};

export default Index;
