import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Grid, CardMedia, Typography, Divider, Box, Avatar, Tooltip, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Chip from 'ui-component/extended/Chip';
import { Stack, useTheme } from '@mui/system';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { IconTallymark1 } from '@tabler/icons';

import { useSelector } from 'react-redux';
import { getPost } from 'store/slices/posting';
import { dispatch } from 'store';

import isEmpty from 'utils/is-empty';
import { SERVER_URL } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import DefaultPostingIcon from 'assets/images/posting/default.png';
import DefaultAvatar from 'assets/images/auth/default.png';
import ChatBubbleTwoToneIcon from '@mui/icons-material/FavoriteOutlined';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';

import { geocodeByPlaceId } from 'react-places-autocomplete';

const PostingDetail = () => {
  const { id } = useParams();
  const { borderRadius } = useConfig();
  const theme = useTheme();

  const [location, setLocation] = React.useState('');

  const { post } = useSelector((state) => state.posting);

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post && post.userId && post.userId.profile && post.userId.profile.placeId) {
      geocodeByPlaceId(post?.userId?.profile?.placeId).then((results) => setLocation(results[0].formatted_address));
    }
  }, [post]);

  return (
    <MainCard title={'Posting Detail'} border={false} elevation={16} content={false} boxShadow>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <CardMedia
              component="img"
              image={post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : DefaultPostingIcon}
              sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden' }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Chip
                        size="small"
                        label={post.listingType}
                        chipcolor={'success'}
                        sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h3">{post.title}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      justifyContent: 'flex-end',
                      [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' }
                    }}
                  >
                    <Grid item>
                      <Tooltip placement="top" title="Message">
                        <Button variant="outlined" sx={{ minWidth: 32, height: 32, p: 0 }}>
                          <ChatBubbleTwoToneIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip placement="top" title="Call">
                        <Button variant="outlined" color="secondary" sx={{ minWidth: 32, height: 32, p: 0 }}>
                          <PhoneTwoToneIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">{post.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h2" color="primary">
                    {post.price}V.H.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <MuiBreadcrumbs
                  sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                  aria-label="breadcrumb"
                  separator={'>'}
                >
                  <Typography variant="body">{post?.subcategoryId?.categoryId?.title}</Typography>
                  <Typography variant="body">{post?.subcategoryId?.title}</Typography>
                </MuiBreadcrumbs>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {post.tags && post?.tags.map((tag, index) => <Chip key={index} label={tag.title} size="small" />)}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Avatar
                    alt={post?.userId?.username}
                    src={post?.userId?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + post?.userId?.profile?.avatar : DefaultAvatar}
                    tooltip={post?.userId?.username}
                  />
                  <Typography variant="h5" sx={{ marginLeft: 1 }}>
                    {post?.userId?.username}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="h5" sx={{ marginLeft: 1 }}>
                    Name
                  </Typography>
                  <Typography variant="caption" sx={{ marginLeft: 1 }}>
                    {post?.userId?.profile?.name}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="h5" sx={{ marginLeft: 1 }}>
                    Location
                  </Typography>
                  <Typography variant="caption" sx={{ marginLeft: 1 }}>
                    {post?.userId?.profile?.placeId ? (
                      <Chip label={location} size="small" chipcolor={'warning'} />
                    ) : (
                      // post?.userId?.profile?.placeId
                      <Chip label="No location" size="small" chipcolor={'warning'} />
                    )}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="h5" sx={{ marginLeft: 1 }}>
                    Balance
                  </Typography>
                  <Typography variant="h4" sx={{ marginLeft: 1 }}>
                    {post?.userId?.account?.balance} V.H.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default PostingDetail;
