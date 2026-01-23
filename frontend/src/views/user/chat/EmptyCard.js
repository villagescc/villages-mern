import React from 'react';
import { Stack, Button, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/MessageTwoTone';

const ChatEmptyCard = ({ handleDrawerOpen, openChatDrawer }) => {
    return (
        <Stack
            sx={{
                width: '100%',
                mx: 2,
                height: 'calc(100vh - 440px)',
                overflowX: 'hidden',
                minHeight: 525
            }}
            alignItems="center"
            justifyContent={'center'}
        >
            <InboxIcon sx={{ fontSize: 150 }} color={'disabled'} />
            <Typography variant={'h1'} align="center">
                It's nice to chat with someone
            </Typography>
            <Typography variant={'body'} align="center">
                Pick a person from left menu and start your conversation
            </Typography>
            <Button onClick={handleDrawerOpen}>{openChatDrawer ? 'Hide menu' : 'Show menu'}</Button>
        </Stack>
    );
};

export default ChatEmptyCard;
