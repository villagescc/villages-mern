import React, { useState } from 'react'
import { SERVER_URL } from 'config';
import DefaultAvatar from 'assets/images/auth/default.png';
import MuiAvatar from '@mui/material/Avatar';
import { useClick, useFloating, useInteractions, useDismiss } from '@floating-ui/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Card, Grid, Box, CardMedia, CardContent, Typography, Button } from '@mui/material';
import DefaultPostingIcon from '../../assets/images/posting/default.png';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const MapPopover = ({ post, index }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(1)
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss
    ]);

    // Styles
    const TrustWrapper = styled(Button)({
        padding: 2,
        minWidth: '100%',
        background: 'rgba(242,29,104,0.2)',
        '& svg': {
            color: '#f21d60'
        },
        '&:hover': {
            background: '#f21d60',
            '& svg': {
                color: '#fff'
            }
        }
    });

    const PaymentWrapper = styled(Button)({
        padding: 2,
        minWidth: '100%',
        background: 'rgba(29, 161, 242, 0.2)',
        '& svg': {
            color: '#1DA1F2'
        },
        '&:hover': {
            background: '#1DA1F2',
            '& svg': {
                color: '#fff'
            }
        }
    });

    const MessageWrapper = styled(Button)({
        padding: 2,
        minWidth: '100%',
        background: 'rgba(14, 118, 168, 0.12)',
        '& svg': {
            color: '#0E76A8'
        },
        '&:hover': {
            background: '#0E76A8',
            '& svg': {
                color: '#fff'
            }
        }
    });

    const handlePagination = (type, length) => {
        if (type === "previous") {
            currentPost > 1 && setCurrentPost(currentPost - 1)
        }
        else {
            currentPost !== length && setCurrentPost(currentPost + 1)
        }
    }

    return (<div key={post?._id}>
        <div ref={refs.setReference} {...getReferenceProps()}>
            <MuiAvatar src={post?.user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + post?.user?.profile?.avatar : DefaultAvatar} style={{ cursor: 'pointer' }} />
        </div>
        {isOpen && (
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
            >
                <Card sx={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button disabled={currentPost === 1} onClick={() => handlePagination('previous', post?.post?.length)}><NavigateBeforeIcon /></Button>
                        <h4 style={{ margin: '0' }}>{currentPost + ' of ' + post?.post?.length}</h4>
                        <Button disabled={currentPost === post?.post?.length} onClick={() => handlePagination('next', post?.post?.length)}><NavigateNextIcon /></Button>

                        {/* Previous</h5>
                      <h5 onClick={() => setCurrentPost(currentPost + 1)}>Next</h5>
                      <span>${currentPost + 'of' + post?.post?.length}</span> */}
                    </Grid>
                    {
                        [post?.post[currentPost - 1]].map((data) => {
                            return <Grid container key={data?._id}>
                                <Grid item xs={6}>
                                    <Box xs={6} sx={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
                                        <CardContent sx={{ flex: '1 0 auto', padding: '0px' }}>
                                            <div>
                                                <Typography variant="h5" component={Link} to={`/${data?.userId?.username}/${data?.title}`}>
                                                    {data?.title}
                                                </Typography>
                                            </div>
                                            <Typography variant="subtitle1" color="text.secondary" component="span" style={{ display: '-webkit-box', '-webkit-line-clamp': '5', overflow: 'hidden', '-webkit-box-orient': 'vertical' }}>
                                                {data?.description}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                                            <Grid container>
                                                <Grid item xs={4} style={{ padding: '2px' }}>
                                                    <TrustWrapper component={Link} to={`/trust/${data?.userId?._id}`} >
                                                        <FavoriteIcon aria-label='icon-Like' />
                                                    </TrustWrapper>
                                                </Grid>
                                                <Grid item xs={4} style={{ padding: '2px' }} >
                                                    <PaymentWrapper component={Link} to={`/pay/${data?.userId?._id}`} >
                                                        <AccountBalanceWalletOutlined />
                                                    </PaymentWrapper>
                                                </Grid>
                                                <Grid item xs={4} style={{ padding: '2px' }} >
                                                    <MessageWrapper component={Link} to={`/personal/message/${data?.userId?._id}`} >
                                                        <ChatIcon />
                                                    </MessageWrapper>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <CardMedia
                                        component="img"
                                        xs={6}
                                        sx={{ height: '100%', objectFit: 'fill' }}
                                        image={data?.photo ? `${SERVER_URL}/upload/posting/` + data.photo : DefaultPostingIcon}
                                        alt="Live from space album cover"
                                    />
                                </Grid>
                            </Grid>
                        })
                    }
                </Card>
            </div>
        )}
    </div>)






    //         < div alt = { post?.postname } key = { post?._id } style = {{ width: 'fit-content', position: 'absolute' }
    // } onClick = {() => handlePopover(post)}>
    //     <MuiAvatar src={post?.user?.profile?.avatar ? `https://villages.io/upload/avatar/` + post?.user?.profile?.avatar : DefaultAvatar} />
    // { popoverFlag && <div key={post?._id}>{post?.user?.username}</div> }
    // {/* {post.user.username} */ }
    //     </ >
}

export default MapPopover